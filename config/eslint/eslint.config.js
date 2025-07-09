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
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: [
          "./tsconfig.json",
          "./tsconfig.node.json",
          "./config/typescript/base.json",
        ],
        tsconfigRootDir: process.cwd(),
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react: react,
    },
    // extends: ["plugin:react/recommended"],
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      // Disable prop-types rule for TypeScript projects
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  }
);
