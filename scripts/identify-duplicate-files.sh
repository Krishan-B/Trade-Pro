#!/bin/bash

# Script to identify duplicate .js files that have corresponding .ts/.tsx files
# Author: GitHub Copilot
# Date: July 9, 2025

echo "===== Identifying duplicate JS/TS files ====="
echo "This script will find .js files that have corresponding .ts/.tsx files"

# Create a log directory
LOG_DIR="/workspaces/Trade-Pro/typescript-fix/logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/duplicate-files-$TIMESTAMP.log"

echo "Starting duplicate file scan at $(date)" | tee -a "$LOG_FILE"
echo "Results will be saved to $LOG_FILE"

# Initialize counters
TOTAL_JS_FILES=0
DUPLICATE_FILES=0
UNIQUE_JS_FILES=0

# Find all .js files in the src directory
JS_FILES=$(find ./src -name "*.js" | sort)

echo "Scanning for duplicate files..."

echo "=== Duplicate Files (have corresponding .ts/.tsx) ===" | tee -a "$LOG_FILE"
# Check each .js file for a corresponding .ts or .tsx file
for js_file in $JS_FILES; do
  TOTAL_JS_FILES=$((TOTAL_JS_FILES + 1))
  
  # Get the base file path without extension
  base_path="${js_file%.js}"
  
  # Check if a corresponding .ts or .tsx file exists
  if [ -f "${base_path}.ts" ] || [ -f "${base_path}.tsx" ]; then
    echo "$js_file" | tee -a "$LOG_FILE"
    DUPLICATE_FILES=$((DUPLICATE_FILES + 1))
  else
    UNIQUE_JS_FILES=$((UNIQUE_JS_FILES + 1))
  fi
done

echo -e "\n=== Summary ===" | tee -a "$LOG_FILE"
echo "Total .js files found: $TOTAL_JS_FILES" | tee -a "$LOG_FILE"
echo "Duplicate files (have .ts/.tsx equivalent): $DUPLICATE_FILES" | tee -a "$LOG_FILE"
echo "Unique .js files (no .ts/.tsx equivalent): $UNIQUE_JS_FILES" | tee -a "$LOG_FILE"

echo -e "\nDuplicate file scan completed at $(date)" | tee -a "$LOG_FILE"
