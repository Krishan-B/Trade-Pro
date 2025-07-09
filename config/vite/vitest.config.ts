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
      // Ensure we are not including server tests here if they need a 'node' environment
      // and not including integration tests meant for Jest.
      "tests/diagnostics/**/*.test.ts",
    ],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/backups/**",
      "**/server/src/__tests__/**", // Explicitly exclude server tests
      "**/tests/integration/**", // Explicitly exclude Jest integration tests
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
