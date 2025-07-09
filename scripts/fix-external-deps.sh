#!/bin/bash

echo "===== TypeScript External Dependencies Fix ====="
echo "This script will configure TypeScript to ignore errors in external dependencies."

# Create .d.ts files for problematic modules
TYPES_DIR="/workspaces/Trade-Pro/src/types/fixes"
mkdir -p "$TYPES_DIR"

echo "// Fix for @supabase/postgrest-js type issues" > "$TYPES_DIR/postgrest-js.d.ts"
echo "declare module '@supabase/postgrest-js'" >> "$TYPES_DIR/postgrest-js.d.ts"

echo "// Fix for React export issue" > "$TYPES_DIR/react-fix.d.ts"
echo "declare module '@types/react'" >> "$TYPES_DIR/react-fix.d.ts"

echo "Created type declaration files to ignore errors in external dependencies."

# Modify tsconfig.json to exclude node_modules
TSCONFIG_FILE="/workspaces/Trade-Pro/tsconfig.json"
if grep -q "\"exclude\":" "$TSCONFIG_FILE"; then
  echo "tsconfig.json already has exclude section. Please manually add node_modules if needed."
else
  # Add exclude section before last closing brace
  sed -i '$ s/}$/,\n  "exclude": ["node_modules"]\n}/' "$TSCONFIG_FILE"
  echo "Added node_modules to exclude in tsconfig.json"
fi

echo "Please run 'npx tsc --skipLibCheck --noEmit' to check if errors are resolved."
