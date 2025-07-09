#!/usr/bin/env ts-node
/**
 * checkSchemaSeed.ts
 * CLI tool to validate that seed SQL files match the live DB schema for specified tables.
 * Usage: ts-node checkSchemaSeed.ts --tables orders,positions --seed ./supabase/seed.sql --failOnMismatch --output pretty --gha
 */
import { execSync } from "child_process";
import fs from "fs";
import minimist from "minimist";
import path from "path";
const argv = minimist(process.argv.slice(2));
const tables = typeof argv.tables === "string"
    ? argv.tables
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
const seedPath = typeof argv.seed === "string" ? argv.seed : "./supabase/seed.sql";
const failOnMismatch = Boolean(argv.failOnMismatch);
const output = typeof argv.output === "string" ? argv.output : "pretty";
const gha = Boolean(argv.gha);
if (!tables.length) {
    console.error("No tables specified. Use --tables orders,positions,...");
    process.exit(1);
}
function log(msg, type = "info") {
    if (gha && type !== "info") {
        const ann = type === "warn" ? "::warning" : "::error";
        console.log(`${ann} ::${msg}`);
    }
    else {
        console[type === "info" ? "log" : type](msg);
    }
}
function getDbColumns(table) {
    const sql = `SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = '${table}';`;
    const result = execSync(`psql "$SUPABASE_DB_URL" -t -c "${sql}"`, {
        encoding: "utf8",
    });
    return result
        .split("\n")
        .map((line) => {
        const parts = line
            .trim()
            .split("|")
            .map((s) => s.trim());
        if (parts.length !== 2)
            return null;
        const [column, is_nullable] = parts;
        return column ? { column, is_nullable } : null;
    })
        .filter((v) => v !== null);
}
function parseSeedColumns(seed, table) {
    // Remove all unnecessary escapes for lint compliance
    const regex = new RegExp(`insert into [\\w.]*${table} *\\(([^)]+)\\)`, "i");
    const match = seed.match(regex);
    if (!match || !Array.isArray(match) || typeof match[1] !== "string")
        return [];
    return match[1].split(",").map((s) => s.trim().replace(/['"`]/g, ""));
}
const seedSql = fs.readFileSync(path.resolve(seedPath), "utf8");
let hasMismatch = false;
for (const table of tables) {
    const dbCols = getDbColumns(table);
    const seedCols = parseSeedColumns(seedSql, table);
    const dbColNames = dbCols.map((c) => c.column);
    const missingInSeed = dbColNames.filter((c) => !seedCols.includes(c));
    const extraInSeed = seedCols.filter((c) => !dbColNames.includes(c));
    const notNullViolations = dbCols.filter((c) => c.is_nullable === "NO" && !seedCols.includes(c.column));
    if (output === "json") {
        console.log(JSON.stringify({
            table,
            dbColNames,
            seedCols,
            missingInSeed,
            extraInSeed,
            notNullViolations,
        }, null, 2));
    }
    else {
        log(`\n[${table}] Schema vs Seed:`);
        log(`  DB columns:      ${dbColNames.join(", ")}`);
        log(`  Seed columns:    ${seedCols.join(", ")}`);
        if (missingInSeed.length)
            log(`  ❌ Missing in seed: ${missingInSeed.join(", ")}`, "warn");
        if (extraInSeed.length)
            log(`  ⚠️  Extra in seed:   ${extraInSeed.join(", ")}`, "warn");
        if (notNullViolations.length)
            log(`  ❗ Not-null in DB but missing in seed: ${notNullViolations
                .map((c) => c.column)
                .join(", ")}`, "error");
        if (!missingInSeed.length &&
            !extraInSeed.length &&
            !notNullViolations.length)
            log("  ✅ Schema and seed are in sync.");
    }
    if (missingInSeed.length || notNullViolations.length)
        hasMismatch = true;
}
if (hasMismatch && failOnMismatch)
    process.exit(1);
