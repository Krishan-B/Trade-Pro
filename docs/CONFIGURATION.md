# Configuration Structure

This document outlines the configuration structure of the Trade-Pro platform.

## Directory Structure

All configuration files are centralized in the `/config` directory, organized by tool:

```
config/
├── eslint/       # ESLint configuration
├── jest/         # Jest test configuration
├── prettier/     # Prettier formatting configuration
├── typescript/   # TypeScript configuration
└── vite/        # Vite build configuration
```

## Prettier Configuration

- **Main Config**: `/config/prettier/prettier.config.json`
- **CJS Module**: `/config/prettier/prettier.config.cjs` (imports the JSON config)
- **Purpose**: Manages code formatting rules across the project
- **Usage**: Referenced in package.json's `format` script

## ESLint Configuration

Located in `/config/eslint/`:

- `eslint.config.js`: Main configuration using the new flat config system
- `index.ts`: TypeScript configuration entrypoint
- Purpose: Handles code linting and style enforcement

## TypeScript Configuration

Located in `/config/typescript/`:

- `base.json`: Base TypeScript configuration
- `app.json`: Application-specific settings
- `node.json`: Node.js specific settings
- `test.json`: Testing configuration

Each config file serves a specific purpose and should not be duplicated.

## Best Practices

1. **Adding New Configuration**:
   - Place in appropriate subdirectory under `/config`
   - Document purpose and usage
   - Update this guide if adding new categories

2. **Modifying Configuration**:
   - Test changes locally before committing
   - Update related scripts in package.json if needed
   - Consider impacts on CI/CD pipeline

3. **Configuration Principles**:
   - Single source of truth for each tool
   - Clear separation of concerns
   - Explicit over implicit settings
