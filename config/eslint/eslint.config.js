import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "coverage",
      "**/coverage",
      "**/lcov-report",
      "build",
      ".next",
      ".nuxt",
      ".docusaurus",
      "node_modules",
      "typescript-fix",
    ],
  },
  // Base config
  {
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
        react: react,
        "@typescript-eslint": tseslint.plugin,
      },
      languageOptions: {
        ecmaVersion: 2020,
      globals: globals.browser,
        parser: tseslint.parser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
      },
      settings: {
        react: {
          version: "detect",
        },
      },
      rules: {
        ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
        "react-refresh/only-export-components": [
          "warn",
          { allowConstantExport: true },
        ],
      "@typescript-eslint/no-unused-vars": "warn",
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
      },
    },
  // Config for main application code (src, shared, root .ts/tsx files, EXCLUDING tests)
    {
      files: ["src/**/*.{ts,tsx}", "shared/**/*.{ts,tsx}", "*.{ts,tsx}"],
      // excludedFiles: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"], // Exclude test files -> This was the error
      // extends: [
      //   js.configs.recommended,
      extends: [
        js.configs.recommended,
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
      ],
      languageOptions: {
        // parser: tseslint.parser, // Already part of tseslint.configs.*
        parserOptions: {
          // ecmaFeatures: { jsx: true }, // Already part of tseslint.configs.*
          project: "./tsconfig.json", // Revert to root tsconfig
          tsconfigRootDir: process.cwd(),
        },
      },
    },
    // Config for test files (Jest and Vitest)
    {
      files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "tests/**/*.{ts,tsx}"], // More specific for tests
      extends: [
        js.configs.recommended,
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
      ],
      languageOptions: {
        globals: { ...globals.jest, ...globals.node }, // Add node globals for tests too
        parserOptions: {
          project: "./tsconfig.json", // Revert to root tsconfig
          tsconfigRootDir: process.cwd(),
        },
      },
      rules: {
        // Relax rules common in tests, or add test-specific plugins later if needed
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-call": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",
        // It's common to have non-null assertions in tests
        "@typescript-eslint/no-non-null-assertion": "off",
      }
    },
    // Config for server code
    {
      files: ["server/src/**/*.ts"],
      extends: [
        js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ],
      languageOptions: {
      globals: globals.node,
        parserOptions: {
          project: "./server/tsconfig.json",
          tsconfigRootDir: process.cwd(),
        },
      },
    },
  // Config for scripts and config files (e.g. vite.config.ts, scripts/*.ts)
    {
    files: ["scripts/**/*.ts", "config/**/*.ts", "*.config.ts", "test-health.ts", "./*.ts"], // Added ./*.ts for root level scripts like test-health.ts
      extends: [
        js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ],
      languageOptions: {
      globals: globals.node,
        parserOptions: {
        project: "./tsconfig.node.json", // Ensure tsconfig.node.json covers these files
          tsconfigRootDir: process.cwd(),
        },
      },
      rules: {
      // Relax rules for scripts if necessary, or fix the scripts
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-call": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-explicit-any": "warn", // Allow any for scripts for now
      }
    }
);
