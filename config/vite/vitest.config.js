import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "../../tests/setup.ts",
        include: [
            "src/__tests__/**/*.test.ts",
            "src/__tests__/**/*.test.tsx",
            "src/**/*.test.ts",
            "src/**/*.test.tsx",
            "tests/diagnostics/**/*.test.ts",
        ],
    },
    resolve: {
        alias: {
            // ALIAS_SYNC_START
            "@": path.resolve(__dirname, "../../src"),
            "@shared": path.resolve(__dirname, "../../src/shared"),
            // ALIAS_SYNC_END
        },
    },
});
