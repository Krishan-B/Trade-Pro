// checkListeners.ts
// CI/CLI health-check for listener leaks using DisposableRegistry
import { EventEmitter } from "events";
import minimist from "minimist";
import { DisposableRegistry } from "./DisposableRegistry";
const argv = minimist(process.argv.slice(2));
const warnThreshold = typeof argv.warn === "number" ? argv.warn : 10;
const exitOnLeak = Boolean(argv.exitOnLeak);
const gha = Boolean(argv.gha);
const traceAbove = typeof argv.traceAbove === "number" ? argv.traceAbove : null;
const registry = new DisposableRegistry(true, warnThreshold);
// --- Diagnostics: use mock emitter cluster for demo ---
const emitters = Array.from({ length: 2 }, () => new EventEmitter());
function on(emitter, event, handler) {
    emitter.on(event, handler);
    return { dispose: () => emitter.removeListener(event, handler) };
}
// Normal listeners
registry.track(on(emitters[0], "data", () => { }));
registry.track(on(emitters[1], "data", () => { }));
// Simulated leak
for (let i = 0; i < warnThreshold + 3; i++) {
    registry.track(on(emitters[0], "leak", () => { }));
}
console.log(`[checkListeners] Listener heatmap:`);
registry.printHeatmap();
if (traceAbove !== null) {
    registry.traceLeaks(traceAbove);
}
console.log(`[checkListeners] Checking for leaks above threshold (${warnThreshold})...`);
// Type guard for registry.heatmap
function getHeatmap(reg) {
    if (reg &&
        typeof reg === "object" &&
        "heatmap" in reg &&
        reg.heatmap instanceof Map) {
        return reg.heatmap;
    }
    return undefined;
}
let leaks = 0;
const heatmap = getHeatmap(registry);
if (heatmap) {
    for (const count of heatmap.values()) {
        if (count > warnThreshold)
            leaks++;
    }
}
if (leaks > 0) {
    if (gha) {
        console.log(`::error :: Listener leak detected: ${leaks} callsite(s) above threshold (${warnThreshold})`);
    }
    else {
        console.warn(`[checkListeners] WARNING: ${leaks} callsite(s) above threshold (${warnThreshold})`);
    }
    registry.warnIfAbove(warnThreshold);
    if (exitOnLeak)
        process.exit(1);
}
else {
    console.log(`[checkListeners] No listener leaks detected.`);
}
console.log("Running listener diagnostics...");
registry.dumpByLifecycle();
registry.warnIfTooMany(3); // Adjust threshold as needed
registry.disposeAll();
