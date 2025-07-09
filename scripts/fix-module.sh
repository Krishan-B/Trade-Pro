#!/usr/bin/env bash

# Module-specific TypeScript auto-fixing script
# This script focuses on fixing TypeScript errors in a specific module

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the module name from command line argument
MODULE=$1

if [ -z "$MODULE" ]; then
  echo -e "${RED}Error: Module name is required.${NC}"
  echo "Usage: $0 <module-name>"
  echo "Example: $0 components/analytics"
  exit 1
fi

echo -e "${GREEN}===== TypeScript Error Fixing for Module: $MODULE =====${NC}"

# Create backup directory
BACKUP_DIR="./typescript-fix/backups/$MODULE/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Find TypeScript files in the specified module
MODULE_PATH="./src/$MODULE"
if [ ! -d "$MODULE_PATH" ]; then
  echo -e "${RED}Error: Module path $MODULE_PATH does not exist.${NC}"
  exit 1
fi

echo -e "${YELLOW}Finding TypeScript files in $MODULE_PATH...${NC}"
TS_FILES=$(find "$MODULE_PATH" -name "*.ts" -o -name "*.tsx" 2>/dev/null)
FILE_COUNT=$(echo "$TS_FILES" | wc -l)

echo -e "${BLUE}Found $FILE_COUNT TypeScript files to process.${NC}"

# Process each file
for file in $TS_FILES; do
  echo -e "${YELLOW}Processing $file${NC}"
  
  # Create the backup directory structure
  REL_PATH=$(echo "$file" | sed "s|$MODULE_PATH/||")
  BACKUP_FILE_DIR="$BACKUP_DIR/$(dirname "$REL_PATH")"
  mkdir -p "$BACKUP_FILE_DIR"
  
  # Backup the file
  cp "$file" "$BACKUP_FILE_DIR/$(basename "$file")"
  
  # Get initial error count for this file
  INITIAL_ERRORS=$(npx eslint --config ./config/eslint/index.js "$file" 2>&1 | grep -c "@typescript-eslint/" || echo 0)
  
  echo "  Initial errors: $INITIAL_ERRORS"
  
  # Apply automatic fixes
  echo "  Applying ESLint auto-fixes..."
  npx eslint --config ./config/eslint/index.js "$file" --fix || true
  
  # Apply specific fixes
  
  # 1. Replace 'any' with 'unknown' as a first step
  if grep -q "any" "$file"; then
    echo "  Replacing 'any' with 'unknown'..."
    sed -i 's/any/unknown/g' "$file"
  fi
  
  # 2. Import proper types from domain.ts if not already imported
  if ! grep -q "import.*from '../types'" "$file" && ! grep -q "import.*from '../../types'" "$file" && ! grep -q "import.*from '@/types'" "$file"; then
    echo "  Adding import for domain types..."
    sed -i '1i import { AppError, Order, Position, Asset, User, Account, Transaction } from "../../types";' "$file"
  fi
  
  # 3. Fix floating promises
  if grep -q "no-floating-promises" "$file"; then
    echo "  Fixing floating promises..."
    # Add void operator to promise calls that are not awaited
    sed -i 's/\([^=]*\)\([a-zA-Z][a-zA-Z0-9_]*\)(.*)/\1void \2()/g' "$file"
  fi
  
  # 4. Add error type guards
  if grep -q "try {" "$file" && ! grep -q "isAppError" "$file"; then
    echo "  Adding error type guards..."
    # Add type guard import if needed
    if ! grep -q "isAppError" "$file"; then
      sed -i '1i import { isAppError } from "../../utils/errorUtils";' "$file"
    fi
    
    # Find catch blocks without type guards
    sed -i 's/catch (error) {/catch (error: unknown) {\n    if (isAppError(error)) {/g' "$file"
    sed -i 's/console.error(error)/console.error(error.message || "Unknown error")/g' "$file"
    # Close the if block
    sed -i 's/}[[:space:]]*\/\/ end catch/    } else {\n      console.error("Unknown error:", error);\n    }\n  } \/\/ end catch/g' "$file"
  fi
  
  # 5. Add return type annotations to functions
  if grep -q "no-unsafe-return" "$file"; then
    echo "  Adding return type annotations..."
    # This is a basic approach - may need manual review
    sed -i 's/function \([a-zA-Z][a-zA-Z0-9_]*\)(/function \1(): unknown (/g' "$file"
    sed -i 's/const \([a-zA-Z][a-zA-Z0-9_]*\) = (/const \1 = (): unknown => (/g' "$file"
  fi
  
  # 6. Apply safe null checks for property access
  if grep -q "no-unsafe-member-access" "$file"; then
    echo "  Adding null checks for property access..."
    # This is a simplified approach - may need manual review
    sed -i 's/\([a-zA-Z][a-zA-Z0-9_]*\)\.\([a-zA-Z][a-zA-Z0-9_]*\)/\1 \&\& \1\.\2/g' "$file"
  fi
  
  # Get final error count for this file
  FINAL_ERRORS=$(npx eslint --config ./config/eslint/index.js "$file" 2>&1 | grep -c "@typescript-eslint/" || echo 0)
  
  echo "  Final errors: $FINAL_ERRORS"
  echo "  Fixed: $(($INITIAL_ERRORS - $FINAL_ERRORS)) errors"
  
  if [ $FINAL_ERRORS -eq 0 ]; then
    echo -e "  ${GREEN}All errors fixed!${NC}"
  else
    echo -e "  ${YELLOW}Remaining errors may require manual fixes.${NC}"
  fi
  
  echo ""
done

# Generate a summary report
SUMMARY_FILE="./typescript-fix/module-fixes-$MODULE-$(date +%Y%m%d).md"

echo "# TypeScript Fix Summary for $MODULE" > "$SUMMARY_FILE"
echo "Generated on $(date)" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "## Files Processed" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"

for file in $TS_FILES; do
  REL_PATH=$(echo "$file" | sed "s|./src/||")
  INITIAL_ERRORS=$(grep -c "@typescript-eslint/" "$BACKUP_DIR/$REL_PATH" 2>/dev/null || echo "N/A")
  FINAL_ERRORS=$(npx eslint --config ./config/eslint/index.js "$file" 2>&1 | grep -c "@typescript-eslint/" || echo 0)
  
  echo "- **$REL_PATH**: $INITIAL_ERRORS -> $FINAL_ERRORS errors" >> "$SUMMARY_FILE"
done

echo "" >> "$SUMMARY_FILE"
echo "## Common Fixes Applied" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "1. Replaced `any` types with `unknown`" >> "$SUMMARY_FILE"
echo "2. Added proper type imports" >> "$SUMMARY_FILE"
echo "3. Fixed floating promises" >> "$SUMMARY_FILE"
echo "4. Added error type guards" >> "$SUMMARY_FILE"
echo "5. Added return type annotations" >> "$SUMMARY_FILE"
echo "6. Added null checks for property access" >> "$SUMMARY_FILE"

echo -e "${GREEN}Module fixes complete!${NC}"
echo -e "${BLUE}Summary report: $SUMMARY_FILE${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the changes to ensure functionality is preserved"
echo "2. Fix any remaining errors manually"
echo "3. Run tests to validate changes"
echo "4. Run ./scripts/typescript-daily-check.sh to update progress tracking"
