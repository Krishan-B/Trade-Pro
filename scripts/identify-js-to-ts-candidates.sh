#!/bin/bash

# This script identifies JavaScript files that are candidates for conversion to TypeScript
# It excludes node_modules, dist, backups, and common configuration files

echo "Identifying JavaScript files that are candidates for TypeScript conversion..."

# Define directories to search
SEARCH_DIRS=("src" "server/src" "shared" "tests")

# Define patterns to exclude (configuration files that should remain as JS)
EXCLUDE_PATTERNS=(
  "eslint.config.js"
  "postcss.config.js"
  "prettier.config.js"
  "tailwind.config.js"
  "vite.config.js"
  "jest.config.js"
  "babel.config.js"
  ".eslintrc.js"
)

# Build the exclude pattern for find command
EXCLUDE_ARGS=""
for pattern in "${EXCLUDE_PATTERNS[@]}"; do
  EXCLUDE_ARGS="$EXCLUDE_ARGS -not -name \"$pattern\""
done

# Find all JavaScript files, excluding node_modules, dist, backups, and config files
echo "=== JavaScript files that could be converted to TypeScript ==="
for dir in "${SEARCH_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    # Use eval to properly handle the exclude arguments
    eval "find $dir -name \"*.js\" -not -path \"*/node_modules/*\" -not -path \"*/dist/*\" -not -path \"*/backups/*\" $EXCLUDE_ARGS"
  fi
done

echo ""
echo "To convert these files to TypeScript, consider using the js-to-ts-cleanup.sh script."
echo "Make sure to back up your files first and test thoroughly after conversion."
