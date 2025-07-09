#!/bin/bash

# Master script for JavaScript to TypeScript cleanup
# Author: GitHub Copilot
# Date: July 9, 2025

echo "===== JavaScript to TypeScript Cleanup ====="
echo "This script will run all cleanup steps in sequence"
echo "1. Identify duplicate files"
echo "2. Remove duplicate files (with backup)"
echo "3. Update TypeScript configuration"
echo "4. Build and test the project"

# Ask for confirmation
read -p "This will modify your codebase. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Operation cancelled."
  exit 0
fi

# Create log directory
LOG_DIR="/workspaces/Trade-Pro/typescript-fix/logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/js-ts-cleanup-$TIMESTAMP.log"

echo "Starting JavaScript to TypeScript cleanup at $(date)" | tee -a "$LOG_FILE"

# Step 1: Identify duplicate files
echo -e "\n==== Step 1: Identifying duplicate files ====" | tee -a "$LOG_FILE"
/workspaces/Trade-Pro/scripts/identify-duplicate-files.sh | tee -a "$LOG_FILE"

# Ask to proceed with removal
read -p "Proceed with removing duplicate files? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Skipping file removal. Cleanup process terminated."
  exit 0
fi

# Step 2: Remove duplicate files
echo -e "\n==== Step 2: Removing duplicate files ====" | tee -a "$LOG_FILE"
echo "y" | /workspaces/Trade-Pro/scripts/remove-duplicate-js-files.sh | tee -a "$LOG_FILE"

# Step 3: Update TypeScript configuration
echo -e "\n==== Step 3: Updating TypeScript configuration ====" | tee -a "$LOG_FILE"
/workspaces/Trade-Pro/scripts/update-typescript-config.sh | tee -a "$LOG_FILE"

# Step 4: Build and test
echo -e "\n==== Step 4: Building and testing the project ====" | tee -a "$LOG_FILE"
echo "Running TypeScript check..." | tee -a "$LOG_FILE"
npm run typecheck | tee -a "$LOG_FILE" || echo "TypeScript check failed. Please review the errors." | tee -a "$LOG_FILE"

echo "Building the project..." | tee -a "$LOG_FILE"
npm run build | tee -a "$LOG_FILE" || echo "Build failed. Please review the errors." | tee -a "$LOG_FILE"

echo -e "\nCleanup process completed at $(date)" | tee -a "$LOG_FILE"
echo "Please review the log file for any errors: $LOG_FILE"
echo "You should commit these changes to the repository if everything works correctly."
