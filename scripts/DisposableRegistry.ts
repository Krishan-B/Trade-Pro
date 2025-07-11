// DisposableRegistry.ts
// Modular disposable registry with heatmap-style usage tracing for listener-heavy scripts or diagnostics.
export class DisposableRegistry {
  tracked: {
    disposable: Disposable;
    context: string;
    lifecyclePhase: string;
  }[] = [];
  disposables = new Set<Disposable>();
  heatmap = new Map<string, number>();
  traceEnabled: boolean;
  warnThreshold: number;

  constructor(traceEnabled = true, warnThreshold = 10) {
    this.traceEnabled = traceEnabled;
    this.warnThreshold = warnThreshold;
  }

  track(
    disposable: Disposable,
    meta?: { context: string; lifecyclePhase: string }
  ): Disposable {
    if (meta?.context && meta.lifecyclePhase) {
      this.tracked.push({
        disposable,
        context: meta.context,
        lifecyclePhase: meta.lifecyclePhase,
      });
      if (meta.lifecyclePhase === "early-init") {
        console.warn(
          `[DisposableRegistry] ⚠️ Registered during risky phase: '${meta.lifecyclePhase}' in context: ${meta.context}`
        );
      }
    }
    if (this.traceEnabled) {
      const stack =
        new Error().stack?.split("\n").slice(2, 7).join("\n") ?? "unknown";
      const count = this.heatmap.get(stack) ?? 0;
      this.heatmap.set(stack, count + 1);
      if (count + 1 > this.warnThreshold) {
        console.warn(
          `[DisposableRegistry] Hotspot: ${
            count + 1
          } disposables from:\n${stack}`
        );
      }
    }
    this.disposables.add(disposable);
    return disposable;
  }
  disposeAll(): void {
    for (const d of this.disposables) {
      try {
        d.dispose();
      } catch (e: unknown) {
        console.warn(
          "[DisposableRegistry] Failed to dispose:",
          e instanceof Error ? e.message : String(e)
        );
      }
    }
    this.disposables.clear();
  }
  printHeatmap(): void {
    if (!this.traceEnabled) return;
    [...this.heatmap.entries()]
      .sort((a, b) => b[1] - a[1])
      .forEach(([stack, count]) => {
        console.log(`🔥 ${count} disposables from:\n${stack}\n`);
      });
  }
  warnIfAbove(threshold: number): void {
    if (!this.traceEnabled) return;
    let warned = false;
    [...this.heatmap.entries()]
      .filter(([, count]) => count > threshold)
      .forEach(([stack, count]) => {
        warned = true;
        console.warn(
          `[DisposableRegistry] WARNING: ${count} disposables from:\n${stack}\n`
        );
      });
    if (!warned) {
      console.log(
        `[DisposableRegistry] All disposable callsites are below threshold (${threshold}).`
      );
    }
  }
  traceLeaks(threshold: number): void {
    if (!this.traceEnabled) return;
    console.log(`🔍 Tracing leaks above threshold: ${threshold}`);
    for (const [stack, count] of this.heatmap.entries()) {
      if (count > threshold) {
        console.warn(`⚠️  ${count} disposables from:\n${stack}\n`);
      }
    }
  }
  dumpByLifecycle(): void {
    const phaseCounts = new Map<string, Map<string, number>>();
    for (const entry of this.tracked) {
      if (!phaseCounts.has(entry.lifecyclePhase)) {
        phaseCounts.set(entry.lifecyclePhase, new Map());
      }
      const contextMap = phaseCounts.get(entry.lifecyclePhase);
      if (contextMap) {
        contextMap.set(entry.context, (contextMap.get(entry.context) ?? 0) + 1);
      }
    }
    console.log("📋 DisposableRegistry Lifecycle Summary:");
    for (const [phase, contextMap] of phaseCounts) {
      console.log(`• Phase: ${phase}`);
      for (const [context, count] of contextMap) {
        console.log(`   - ${context}: ${count}`);
      }
    }
  }
  warnIfTooMany(threshold = 3): void {
    const counts = new Map<string, number>();
    for (const { context, lifecyclePhase } of this.tracked) {
      const key = `${lifecyclePhase}::${context}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    for (const [key, count] of counts) {
      if (count > threshold) {
        console.warn(
          `[DisposableRegistry] ⚠️ High listener count (${count}) for ${key}`
        );
      }
    }
  }
}

// Disposable interface for type safety
export interface Disposable {
  dispose(): void;
}
// Example usage:
// import { DisposableRegistry } from './DisposableRegistry';
// const registry = new DisposableRegistry(true, 10);
// const disposable = someEmitter.on('event', handler);
// registry.track(disposable, { context: 'MyContext', lifecyclePhase: 'early-init' });
// ...
// registry.disposeAll();
// registry.printHeatmap();
// registry.dumpByLifecycle();
