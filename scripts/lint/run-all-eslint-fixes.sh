#!/bin/bash

# Script to run all ESLint fixes in the Trade-Pro project
# Author: GitHub Copilot
# Date: July 9, 2025

set -e  # Exit on error

echo "===== Running Comprehensive ESLint Fixes ====="

# Create logs directory
LOG_DIR="/workspaces/Trade-Pro/typescript-fix/logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/complete-eslint-fixes-$TIMESTAMP.log"

echo "Starting comprehensive ESLint fixes at $(date)" | tee -a "$LOG_FILE"

# Step 1: Fix UI component parsing errors
echo -e "\n=== Step 1: Fixing UI Component Parsing Errors ===" | tee -a "$LOG_FILE"
/workspaces/Trade-Pro/scripts/fix-ui-parsing-errors.sh | tee -a "$LOG_FILE"

# Step 2: Fix ESLint errors in priority modules
echo -e "\n=== Step 2: Fixing Priority Module ESLint Errors ===" | tee -a "$LOG_FILE"
/workspaces/Trade-Pro/scripts/fix-eslint-priority-modules.sh | tee -a "$LOG_FILE"

# Step 3: Run ESLint auto-fix on the entire project
echo -e "\n=== Step 3: Running ESLint Auto-Fix on Entire Project ===" | tee -a "$LOG_FILE"
npx eslint --ext .tsx,.ts,.js src --fix | tee -a "$LOG_FILE"

# Step 4: Final verification
echo -e "\n=== Step 4: Final Verification ===" | tee -a "$LOG_FILE"
echo "Running TypeScript type check with skipLibCheck..." | tee -a "$LOG_FILE"
npx tsc --skipLibCheck --noEmit | tee -a "$LOG_FILE"

echo "Running ESLint on the entire project..." | tee -a "$LOG_FILE"
npx eslint --ext .tsx,.ts,.js src --format json > all-eslint-verification.json

# Check for fatal errors
FATAL_ERRORS=$(grep -c "\"fatal\": true" all-eslint-verification.json || echo "0")
echo "Fatal errors found: $FATAL_ERRORS" | tee -a "$LOG_FILE"

if [ "$FATAL_ERRORS" -gt 0 ]; then
  echo "⚠️ There are still fatal errors. Please review all-eslint-verification.json for details." | tee -a "$LOG_FILE"
else
  echo "🎉 No fatal errors found. ESLint fixes have been successfully applied!" | tee -a "$LOG_FILE"
fi

echo -e "\nAll ESLint fix procedures completed at $(date)" | tee -a "$LOG_FILE"
echo "Log file saved to: $LOG_FILE"
