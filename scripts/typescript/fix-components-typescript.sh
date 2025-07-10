#!/usr/bin/env bash

# Script to fix TypeScript issues in critical components
# Focuses on highest-error components identified in analysis

set -e

echo "Fixing TypeScript issues in critical components..."

# Critical components based on error analysis
COMPONENTS=(
  "./src/components/analytics/LeverageAnalytics.tsx"
  "./src/components/positions/PositionDetailsModal.tsx"
  "./src/components/leverage/MarginTracker.tsx"
)

# Backup files before modification
BACKUP_DIR="./typescript-fix/backups/components/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
for file in "${COMPONENTS[@]}"; do
  if [ -f "$file" ]; then
    DIR_STRUCTURE=$(dirname "$file" | sed 's|./src/||')
    mkdir -p "$BACKUP_DIR/$DIR_STRUCTURE"
    cp "$file" "$BACKUP_DIR/$DIR_STRUCTURE/$(basename "$file")"
  fi
done

# Run auto-fixes
echo "Running auto-fixes..."
for file in "${COMPONENTS[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    npx eslint --config ./config/eslint/index.js "$file" --fix || true
  fi
done

echo "Component fixes applied. Please review changes and address remaining issues manually."
