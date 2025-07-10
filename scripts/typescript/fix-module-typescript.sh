#!/usr/bin/env bash

# Module-specific TypeScript fix script
# Usage: ./fix-module-typescript.sh <module-name>

set -e

MODULE=${1}

if [ -z "$MODULE" ]; then
  echo "Usage: $0 <module-name>"
  echo "Example: $0 auth"
  exit 1
fi

echo "Fixing TypeScript issues in $MODULE module..."

# Find files in the module
FILES=$(find ./src -path "*$MODULE*" -name "*.ts" -o -name "*.tsx")

# Run ESLint with --fix option on these files
for file in $FILES; do
  echo "Fixing $file..."
  npx eslint --config ./config/eslint/index.js "$file" --fix || true
done

# Check remaining errors
echo "Checking remaining errors..."
npx eslint --config ./config/eslint/index.js $FILES

echo "Done! Please review changes and fix any remaining issues manually."
