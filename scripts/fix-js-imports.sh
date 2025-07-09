#!/bin/bash

# fix-js-imports.sh
# Script to fix JavaScript imports in TypeScript files after conversion
# Author: GitHub Copilot
# Date: July 9, 2025

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Setup log directory
LOG_DIR="/workspaces/Trade-Pro/typescript-fix/logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/fix-js-imports-$TIMESTAMP.log"

echo -e "${BLUE}======== Fix JavaScript Imports ========${NC}"
echo "This script will find and fix imports that reference .js files"
echo -e "Log will be saved to: ${LOG_FILE}\n"

# Function to fix imports in a file
fix_imports() {
  local file=$1
  local found=false
  
  echo -e "Checking ${YELLOW}$file${NC}" | tee -a "$LOG_FILE"
  
  # Create a backup of the file
  cp "$file" "${file}.bak"
  
  # Replace imports with .js extension
  if grep -q "from ['\"].*\.js['\"]" "$file"; then
    found=true
    # Replace the .js extension in imports
    sed -i 's/from \(['"'"'"]\)\(.*\)\.js\1/from \1\2\1/g' "$file"
    echo -e "  ${GREEN}Fixed${NC} .js imports in $file" | tee -a "$LOG_FILE"
  fi
  
  # Replace imports with .jsx extension
  if grep -q "from ['\"].*\.jsx['\"]" "$file"; then
    found=true
    # Replace the .jsx extension in imports
    sed -i 's/from \(['"'"'"]\)\(.*\)\.jsx\1/from \1\2\1/g' "$file"
    echo -e "  ${GREEN}Fixed${NC} .jsx imports in $file" | tee -a "$LOG_FILE"
  fi
  
  if [ "$found" = false ]; then
    # Remove the backup if no changes were made
    rm "${file}.bak"
  fi
  
  return 0
}

# Function to process directories
process_directories() {
  local dirs=("$@")
  local fixed=0
  local total=0
  
  echo -e "\n${BLUE}Scanning directories for TypeScript files...${NC}"
  
  for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
      echo -e "Scanning ${YELLOW}$dir${NC}"
      
      # Find all TypeScript files in the directory
      while IFS= read -r file; do
        ((total++))
        fix_imports "$file"
        ((fixed++))
      done < <(find "$dir" -type f \( -name "*.ts" -o -name "*.tsx" \) -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/backups/*")
    fi
  done
  
  echo -e "\n${GREEN}Import fixing complete:${NC}"
  echo -e "  - ${BLUE}$total files scanned${NC}"
  echo -e "  - ${GREEN}$fixed files processed${NC}"
  echo -e "\nBackups were created with .bak extension for modified files"
  
  return 0
}

# Ask for confirmation
read -p "This will fix .js/.jsx imports in TypeScript files. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Operation cancelled."
  exit 0
fi

# Directories to process
DIRS=("src" "server/src" "shared" "tests")

# Process all directories
process_directories "${DIRS[@]}"

echo -e "\n${BLUE}Next steps:${NC}"
echo "1. Verify the changes with: npm run typecheck"
echo "2. Run tests: npm test"
echo "3. Build the application: npm run build"
echo -e "\nLog file saved to: ${LOG_FILE}"
