import * as eslintConfig from "./config/eslint/eslint.config.js";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
      "**/.next/**",
      "**/.nuxt/**",
      "**/.docusaurus/**",
    ],
  },
  ...eslintConfig.default,
];
