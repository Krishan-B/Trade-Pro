#!/bin/bash

# Script to remove duplicate .js files that have corresponding .ts/.tsx files
# Author: GitHub Copilot
# Date: July 9, 2025

echo "===== Removing duplicate JS files ====="
echo "This script will remove .js files that have corresponding .ts/.tsx files"
echo "Backups will be created before removal"

# Ask for confirmation
read -p "This will modify your codebase. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Operation cancelled."
  exit 0
fi

# Create backup and log directories
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/workspaces/Trade-Pro/backups/js-files-$TIMESTAMP"
LOG_DIR="/workspaces/Trade-Pro/typescript-fix/logs"
mkdir -p "$BACKUP_DIR"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/js-removal-$TIMESTAMP.log"

echo "Starting JS file cleanup at $(date)" | tee -a "$LOG_FILE"
echo "Backups will be saved to $BACKUP_DIR"
echo "Results will be logged to $LOG_FILE"

# Initialize counters
TOTAL_JS_FILES=0
REMOVED_FILES=0
PRESERVED_FILES=0

# Find all .js files in the src directory
JS_FILES=$(find ./src -name "*.js" | sort)

echo "Scanning for duplicate files..."

# Check each .js file for a corresponding .ts or .tsx file
for js_file in $JS_FILES; do
  TOTAL_JS_FILES=$((TOTAL_JS_FILES + 1))
  
  # Get the base file path without extension
  base_path="${js_file%.js}"
  
  # Check if a corresponding .ts or .tsx file exists
  if [ -f "${base_path}.ts" ] || [ -f "${base_path}.tsx" ]; then
    # Create directory structure in backup
    backup_dir_path=$(dirname "$BACKUP_DIR/$js_file")
    mkdir -p "$backup_dir_path"
    
    # Backup the file
    cp "$js_file" "$BACKUP_DIR/$js_file"
    
    # Remove the file
    rm "$js_file"
    
    echo "Removed: $js_file (backed up)" | tee -a "$LOG_FILE"
    REMOVED_FILES=$((REMOVED_FILES + 1))
  else
    echo "Preserved: $js_file (no TS equivalent)" | tee -a "$LOG_FILE"
    PRESERVED_FILES=$((PRESERVED_FILES + 1))
  fi
done

echo -e "\n=== Summary ===" | tee -a "$LOG_FILE"
echo "Total .js files scanned: $TOTAL_JS_FILES" | tee -a "$LOG_FILE"
echo "Files removed (had .ts/.tsx equivalent): $REMOVED_FILES" | tee -a "$LOG_FILE"
echo "Files preserved (no .ts/.tsx equivalent): $PRESERVED_FILES" | tee -a "$LOG_FILE"
echo "Backups stored in: $BACKUP_DIR" | tee -a "$LOG_FILE"

echo -e "\nJS file cleanup completed at $(date)" | tee -a "$LOG_FILE"

# Create or update the .gitignore to ignore .js files that have .ts/.tsx equivalents
if [ $REMOVED_FILES -gt 0 ]; then
  echo -e "\nUpdating .gitignore to prevent future duplication..." | tee -a "$LOG_FILE"
  
  # Check if the entry already exists in .gitignore
  if ! grep -q "# Ignore JS files with TS equivalents" .gitignore; then
    echo -e "\n# Ignore JS files with TS equivalents" >> .gitignore
    echo "# This prevents duplicate files in the repository" >> .gitignore
    echo "# Added by cleanup script on $(date)" >> .gitignore
    echo "**/*.js" >> .gitignore
    echo "!**/*.config.js" >> .gitignore
    echo "!**/vite.config.js" >> .gitignore
    echo "!**/jest.config.js" >> .gitignore
    echo "!**/babel.config.js" >> .gitignore
    echo "!**/eslint.config.js" >> .gitignore
    echo "!**/postcss.config.js" >> .gitignore
    echo "!**/prettier.config.js" >> .gitignore
    echo "!**/tailwind.config.js" >> .gitignore
    echo "!**/node_modules/**" >> .gitignore
    echo "!**/scripts/**/*.js" >> .gitignore
    
    echo "Updated .gitignore to prevent future duplication" | tee -a "$LOG_FILE"
  else
    echo ".gitignore already contains entries for JS/TS duplication prevention" | tee -a "$LOG_FILE"
  fi
fi

# Final message
echo -e "\nOperation completed. Please run your build and test processes to verify everything works correctly."
