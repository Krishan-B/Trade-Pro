import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    // Global ignores
    ignores: ['dist', 'node_modules', '.vscode'],
  },
  // Base JS configuration
  js.configs.recommended,
  // TypeScript configurations
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    // TypeScript and React specific configuration
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Turn off rules that are not needed or conflict
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      // The following rule is re-enabled below with proper configuration
      '@typescript-eslint/dot-notation': 'off', 
    },
  },
  {
    // Re-enable dot-notation with correct options
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/dot-notation': [
        'error',
        {
          allowKeywords: true,
        },
      ],
    },
  },
  // Prettier configuration to disable conflicting style rules
  prettier,
);