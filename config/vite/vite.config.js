import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // ALIAS_SYNC_START
            "@": path.resolve(__dirname, "../../src"),
            "@shared": path.resolve(__dirname, "../../src/shared"),
            // ALIAS_SYNC_END
        },
        dedupe: ["react", "react-dom"],
    },
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "../../tests/setup.ts",
        exclude: ["**/node_modules/**", "**/dist/**", "**/backups/**"],
    },
});
