#!/bin/bash

# Script to update TypeScript configuration to prevent JS/TS duplication
# Author: GitHub Copilot
# Date: July 9, 2025

echo "===== Updating TypeScript Configuration ====="
echo "This script will update TypeScript configuration to prevent JS/TS duplication"

# Create log directory
LOG_DIR="/workspaces/Trade-Pro/typescript-fix/logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/tsconfig-update-$TIMESTAMP.log"

echo "Starting TypeScript config update at $(date)" | tee -a "$LOG_FILE"

# Backup original tsconfig files
echo "Backing up original tsconfig files..." | tee -a "$LOG_FILE"
BACKUP_DIR="/workspaces/Trade-Pro/backups/tsconfig-$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

cp /workspaces/Trade-Pro/tsconfig.json "$BACKUP_DIR/tsconfig.json" || echo "Warning: Failed to backup tsconfig.json" | tee -a "$LOG_FILE"
cp /workspaces/Trade-Pro/config/typescript/base.json "$BACKUP_DIR/base.json" || echo "Warning: Failed to backup base.json" | tee -a "$LOG_FILE"

# Update the base TypeScript configuration
echo "Updating base TypeScript configuration..." | tee -a "$LOG_FILE"

# Check if outDir is already in base.json
if ! grep -q "outDir" /workspaces/Trade-Pro/config/typescript/base.json; then
  # Create a temporary file
  TMP_FILE=$(mktemp)
  
  # Update the compilerOptions to include outDir and exclude the dist directory from compilation
  cat /workspaces/Trade-Pro/config/typescript/base.json | 
  jq '.compilerOptions += {"outDir": "./dist", "sourceMap": true}' |
  jq '.include = if .include then .include else ["src", "shared", "tests", "test", "__tests__"] end' |
  jq '.exclude = if .exclude then .exclude + ["dist"] else ["node_modules", "dist"] end' > "$TMP_FILE"
  
  # Replace the original file with the updated one
  mv "$TMP_FILE" /workspaces/Trade-Pro/config/typescript/base.json
  
  echo "Updated base.json with outDir configuration" | tee -a "$LOG_FILE"
else
  echo "outDir is already configured in base.json" | tee -a "$LOG_FILE"
fi

# Update .gitignore to exclude the dist directory
if ! grep -q "# TypeScript compiled output" /workspaces/Trade-Pro/.gitignore; then
  echo -e "\n# TypeScript compiled output" >> /workspaces/Trade-Pro/.gitignore
  echo "dist" >> /workspaces/Trade-Pro/.gitignore
  echo "*.tsbuildinfo" >> /workspaces/Trade-Pro/.gitignore
  
  echo "Updated .gitignore to exclude TypeScript compiled output" | tee -a "$LOG_FILE"
else
  echo ".gitignore already excludes TypeScript compiled output" | tee -a "$LOG_FILE"
fi

# Add or update build:clean script in package.json
echo "Updating package.json scripts..." | tee -a "$LOG_FILE"

# Create a temporary file
TMP_FILE=$(mktemp)

# Check if build:clean script already exists
if ! grep -q "build:clean" /workspaces/Trade-Pro/package.json; then
  # Add build:clean script
  cat /workspaces/Trade-Pro/package.json | 
  jq '.scripts["build:clean"] = "rm -rf dist && npm run build"' > "$TMP_FILE"
  
  # Replace the original file with the updated one
  mv "$TMP_FILE" /workspaces/Trade-Pro/package.json
  
  echo "Added build:clean script to package.json" | tee -a "$LOG_FILE"
else
  echo "build:clean script already exists in package.json" | tee -a "$LOG_FILE"
fi

echo -e "\nTypeScript configuration update completed at $(date)" | tee -a "$LOG_FILE"
echo "Please rebuild your project with 'npm run build:clean' to verify the changes"
