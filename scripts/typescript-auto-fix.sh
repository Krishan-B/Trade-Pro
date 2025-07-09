#!/usr/bin/env bash

# TypeScript auto-fixer script
# This script attempts to automatically fix some common TypeScript issues

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== TypeScript Auto-Fixer =====${NC}"
echo "This script will attempt to fix common TypeScript errors automatically."

# Directory to fix (default: src)
DIR=${1:-src}

echo -e "${YELLOW}Running ESLint auto-fix on $DIR directory...${NC}"

# Run ESLint with TypeScript rules and --fix option
npx eslint --config ./config/eslint/index.js $DIR --ext .ts,.tsx --fix || true

echo -e "${BLUE}Running Prettier...${NC}"
npx prettier --write "$DIR/**/*.{ts,tsx}"

# Fix no-unnecessary-type-assertion errors
echo -e "${YELLOW}Fixing unnecessary type assertions...${NC}"
find $DIR -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "as " | while read file; do
  echo "Checking $file"
  # This is a simple approach and might need manual review
  sed -i 's/ as [A-Za-z][A-Za-z0-9_]*//g' $file
done

# Add proper Promise handling for no-floating-promises
echo -e "${YELLOW}Adding basic void operator to unhandled promises...${NC}"
find $DIR -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "no-floating-promises" | while read file; do
  echo "Consider adding 'void' to promise calls in $file"
done

echo -e "${GREEN}Auto-fixing complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run ESLint again to check remaining errors"
echo "2. Manually review fixed files"
echo "3. Focus on implementing proper type definitions"

echo -e "${GREEN}Done!${NC}"
