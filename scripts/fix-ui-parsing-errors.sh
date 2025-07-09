#!/bin/bash

# Script to fix parsing errors in UI components with the pattern "cn( as string"
# Author: GitHub Copilot
# Date: July 9, 2025

set -e  # Exit on error

echo "🔍 Scanning UI components for parsing errors..."

# Create a backup directory
BACKUP_DIR="/workspaces/Trade-Pro/backups/ui-components-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Created backup directory: $BACKUP_DIR"

# Find all UI component files
UI_FILES=$(find /workspaces/Trade-Pro/src/shared/ui -name "*.tsx")

# Count of files and errors fixed
TOTAL_FILES=0
TOTAL_ERRORS=0

for file in $UI_FILES; do
  # Create a backup of the original file
  filename=$(basename "$file")
  cp "$file" "$BACKUP_DIR/$filename"
  
  # Count errors in this file
  errors_count=$(grep -c " as string" "$file" || true)
  
  if [ "$errors_count" -gt 0 ]; then
    echo "🔧 Fixing $filename (found $errors_count errors)"
    
    # Fix the "cn( as string" pattern - replace with just "cn("
    sed -i 's/cn( as string/cn(/g' "$file"
    
    TOTAL_ERRORS=$((TOTAL_ERRORS + errors_count))
    TOTAL_FILES=$((TOTAL_FILES + 1))
  fi
done

echo "✅ Fixed $TOTAL_ERRORS parsing errors across $TOTAL_FILES UI component files"
echo "🔒 Original files backed up to $BACKUP_DIR"

# Run ESLint to check if the errors are resolved
echo "🧪 Running ESLint to verify fixes..."
npx eslint --ext .tsx --ext .ts src/shared/ui --format json > ui-eslint-errors-fixed.json

# Check if there are still parsing errors
parsing_errors=$(grep -c "Parsing error: ',' expected" ui-eslint-errors-fixed.json || true)

if [ "$parsing_errors" -gt 0 ]; then
  echo "⚠️ There are still $parsing_errors parsing errors. Additional fixes may be needed."
else
  echo "🎉 All parsing errors have been resolved successfully!"
fi

echo "📊 Results saved to ui-eslint-errors-fixed.json"
