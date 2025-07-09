#!/usr/bin/env bash

# Script to fix TypeScript issues in the auth module
# This is a high-priority module based on error analysis

set -e

echo "Fixing TypeScript issues in Auth module..."

# Find auth module files
AUTH_FILES=$(find ./src/features/auth -name "*.ts" -o -name "*.tsx")

# Backup files before modification
BACKUP_DIR="./typescript-fix/backups/auth/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
for file in $AUTH_FILES; do
  DIR_STRUCTURE=$(dirname "$file" | sed 's|./src/||')
  mkdir -p "$BACKUP_DIR/$DIR_STRUCTURE"
  cp "$file" "$BACKUP_DIR/$DIR_STRUCTURE/$(basename "$file")"
done

# Run auto-fixes
echo "Running auto-fixes..."
npx eslint --config ./config/eslint/index.js $AUTH_FILES --fix || true

# Specific fixes for AuthProvider.tsx (one of the highest error files)
AUTH_PROVIDER="./src/features/auth/context/AuthProvider.tsx"
if [ -f "$AUTH_PROVIDER" ]; then
  echo "Applying specific fixes to AuthProvider.tsx..."
  
  # Replace 'any' types with proper types from domain.ts
  sed -i 's/any/unknown/g' "$AUTH_PROVIDER"
  
  # Check if fixes were applied
  if grep -q "unknown" "$AUTH_PROVIDER"; then
    echo "Replaced 'any' with 'unknown' as an intermediate step. Manual review required."
  fi
fi

echo "Auth module fixes applied. Please review changes and address remaining issues manually."
