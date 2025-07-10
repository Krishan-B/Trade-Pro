// sync-aliases.js
// Synchronize path aliases from tsconfig.json to Vite, Vitest, and Jest configs

const fs = require("fs");
const path = require("path");

// --- CONFIG ---
const tsconfigPath = path.resolve(__dirname, "../tsconfig.json");
const viteConfigPath = path.resolve(__dirname, "../config/vite/vite.config.ts");
const vitestConfigPath = path.resolve(
  __dirname,
  "../config/vite/vitest.config.ts"
);
const jestConfigPath = path.resolve(
  __dirname,
  "../config/jest/jest.config.mjs"
);

// --- HELPERS ---
function getTsconfigAliases(tsconfig) {
  const paths =
    (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) || {};
  const aliases = {};
  for (const [alias, targets] of Object.entries(paths)) {
    // Convert @/* to @
    const viteAlias = alias.replace(/\/$/, "");
    const viteTarget = targets[0].replace(/\/*$/, "");
    aliases[viteAlias] = viteTarget;
  }
  return aliases;
}

function updateViteConfig(filePath, aliases) {
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/alias: \{[\s\S]*?\},/m, () => {
    const aliasEntries = Object.entries(aliases)
      .map(([k, v]) => `      "${k}": path.resolve(__dirname, "../${v}"),`)
      .join("\n");
    return `alias: {\n${aliasEntries}\n    },`;
  });
  fs.writeFileSync(filePath, content);
  console.log("Updated Vite config aliases.");
}

function updateVitestConfig(filePath, aliases) {
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/alias: \{[\s\S]*?\},/m, () => {
    const aliasEntries = Object.entries(aliases)
      .map(([k, v]) => `      "${k}": path.resolve(process.cwd(), "${v}"),`)
      .join("\n");
    return `alias: {\n${aliasEntries}\n    },`;
  });
  fs.writeFileSync(filePath, content);
  console.log("Updated Vitest config aliases.");
}

function updateJestConfig(filePath, aliases) {
  let content = fs.readFileSync(filePath, "utf8");
  content = content.replace(/moduleNameMapper: \{[\s\S]*?\},/m, () => {
    const aliasEntries = Object.entries(aliases)
      .map(([k, v]) => `    '^${k}/(.*)$': '<rootDir>/${v}/$1',`)
      .join("\n");
    return `moduleNameMapper: {\n${aliasEntries}\n  },`;
  });
  fs.writeFileSync(filePath, content);
  console.log("Updated Jest config aliases.");
}

// --- MAIN ---
function main() {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
  const aliases = getTsconfigAliases(tsconfig);
  updateViteConfig(viteConfigPath, aliases);
  updateVitestConfig(vitestConfigPath, aliases);
  updateJestConfig(jestConfigPath, aliases);
  console.log("Alias synchronization complete!");
}

main();
