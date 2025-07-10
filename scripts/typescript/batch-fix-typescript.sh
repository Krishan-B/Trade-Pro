#!/usr/bin/env bash

# Batch TypeScript fixing script
# This script automatically runs through all modules to fix TypeScript errors

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Batch TypeScript Error Fixing =====${NC}"
echo "This script will fix TypeScript errors across all modules in sequence."

# Create log directory
LOG_DIR="./typescript-fix/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/batch-fix-$(date +%Y%m%d_%H%M%S).log"

echo "Starting batch TypeScript error fixing on $(date)" > "$LOG_FILE"

# Define the module order for fixing (from most fundamental to most dependent)
MODULES=(
  "types"
  "utils"
  "services"
  "hooks"
  "store"
  "features/auth"
  "components/analytics"
  "components/positions"
  "components/leverage"
  "components/orders"
  "components"
  "features"
)

# Get initial error count
echo -e "${YELLOW}Getting initial error count...${NC}" | tee -a "$LOG_FILE"
INITIAL_COUNT=$(npx eslint --config ./config/eslint/index.js ./src --ext .ts,.tsx 2>&1 | grep -c "@typescript-eslint/" || echo 0)
echo "Initial TypeScript errors: $INITIAL_COUNT" | tee -a "$LOG_FILE"

# Fix each module in sequence
for module in "${MODULES[@]}"; do
  echo -e "${BLUE}Processing module: $module${NC}" | tee -a "$LOG_FILE"
  
  if [ -d "./src/$module" ]; then
    # Run the module-specific fix script
    ./scripts/fix-module.sh "$module" | tee -a "$LOG_FILE"
    echo -e "${GREEN}Completed fixes for $module${NC}" | tee -a "$LOG_FILE"
  else
    echo -e "${RED}Module directory not found: ./src/$module${NC}" | tee -a "$LOG_FILE"
  fi
  
  # Get current error count
  CURRENT_COUNT=$(npx eslint --config ./config/eslint/index.js ./src --ext .ts,.tsx 2>&1 | grep -c "@typescript-eslint/" || echo 0)
  echo "Errors after fixing $module: $CURRENT_COUNT" | tee -a "$LOG_FILE"
  echo "Fixed so far: $(($INITIAL_COUNT - $CURRENT_COUNT)) errors" | tee -a "$LOG_FILE"
  echo "-----------------------------------------" | tee -a "$LOG_FILE"
done

# Get final error count
FINAL_COUNT=$(npx eslint --config ./config/eslint/index.js ./src --ext .ts,.tsx 2>&1 | grep -c "@typescript-eslint/" || echo 0)
FIXED_COUNT=$(($INITIAL_COUNT - $FINAL_COUNT))
PERCENTAGE=$(( $FIXED_COUNT * 100 / $INITIAL_COUNT ))

echo -e "${GREEN}Batch TypeScript fixing completed!${NC}" | tee -a "$LOG_FILE"
echo "Initial errors: $INITIAL_COUNT" | tee -a "$LOG_FILE"
echo "Remaining errors: $FINAL_COUNT" | tee -a "$LOG_FILE"
echo "Fixed errors: $FIXED_COUNT" | tee -a "$LOG_FILE"
echo "Success rate: $PERCENTAGE%" | tee -a "$LOG_FILE"

# Update progress tracking
echo -e "${YELLOW}Updating progress tracking...${NC}"
./scripts/typescript-daily-check.sh

echo -e "${BLUE}Log file: $LOG_FILE${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the changes to ensure functionality is preserved"
echo "2. Fix any remaining errors manually"
echo "3. Run tests to validate the application still works"
echo "4. Commit changes to preserve the progress"
