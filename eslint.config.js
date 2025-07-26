import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';
import js from '@eslint/js';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.vscode/',
      'coverage/',
      'vite.config.ts',
      'postcss.config.js',
      'tailwind.config.ts',
      'jest.config.js',
      'eslint.config.js', // ignore self
    ],
  },

  // Base JS config
  js.configs.recommended,

  // Base TS config
  ...tseslint.configs.recommended,

  // React-specific configurations
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Type-aware linting configuration
  {
    files: ['src/**/*.{ts,tsx}', 'supabase/**/*.ts'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },

  // Config for JS/CJS files (e.g., config files)
  {
    files: ['**/*.js', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Prettier config must be last to override other formatting rules
  prettierConfig,

  // Override for specific files
  {
    files: ['src/AppRoutes.tsx'],
    rules: {
      'react/display-name': 'off',
    },
  },
);