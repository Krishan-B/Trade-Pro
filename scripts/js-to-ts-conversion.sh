#!/bin/bash

# js-to-ts-conversion.sh
# Script to convert JavaScript files to TypeScript
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
LOG_FILE="$LOG_DIR/js-to-ts-conversion-$TIMESTAMP.log"

echo -e "${BLUE}======== JavaScript to TypeScript Conversion ========${NC}"
echo "This script will convert JavaScript files to TypeScript"
echo -e "Log will be saved to: ${LOG_FILE}\n"

# Function to convert a file
convert_file() {
  local js_file=$1
  local ts_file=${js_file%.js}.ts
  
  # For test files, use .test.ts extension
  if [[ $js_file == *test.js ]]; then
    ts_file=${js_file%.js}.ts
  fi
  
  # For JSX files (containing React components), use .tsx extension
  if grep -q "import React" "$js_file" || grep -q "from 'react'" "$js_file" || grep -q "from \"react\"" "$js_file"; then
    ts_file=${js_file%.js}.tsx
  fi

  # Create backup
  cp "$js_file" "${js_file}.bak"
  
  echo -e "${YELLOW}Converting${NC} $js_file ${YELLOW}to${NC} $ts_file"
  
  # Copy content with minimal modifications
  cat "$js_file" > "$ts_file"
  
  # Remove the original JS file
  rm "$js_file"
  
  echo -e "${GREEN}Converted${NC} $js_file ${GREEN}to${NC} $ts_file" | tee -a "$LOG_FILE"
  return 0
}

# Function to process a batch of files
process_files() {
  local files=("$@")
  local converted=0
  local failed=0
  
  echo -e "\n${BLUE}Processing ${#files[@]} files...${NC}"
  
  for file in "${files[@]}"; do
    if convert_file "$file"; then
      ((converted++))
    else
      ((failed++))
      echo -e "${RED}Failed to convert${NC} $file" | tee -a "$LOG_FILE"
    fi
  done
  
  echo -e "\n${GREEN}Conversion complete:${NC}"
  echo -e "  - ${GREEN}$converted files converted${NC}"
  echo -e "  - ${RED}$failed files failed${NC}"
  echo -e "\nBackups were created with .bak extension"
  
  return 0
}

# Ask for confirmation
read -p "This will convert JS files to TS/TSX. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Operation cancelled."
  exit 0
fi

# Ask which files to convert
echo -e "\n${BLUE}Which files would you like to convert?${NC}"
echo "1) All JavaScript files identified by identify-js-to-ts-candidates.sh"
echo "2) Select specific files"
echo "3) Convert files in a specific directory"
read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    echo "Identifying JavaScript files..."
    # Get the list of files from the identification script
    mapfile -t files < <(/workspaces/Trade-Pro/scripts/identify-js-to-ts-candidates.sh | grep -v "===" | grep -v "To convert" | grep -v "^$")
    process_files "${files[@]}"
    ;;
  2)
    echo "Enter the file paths to convert, separated by spaces:"
    read -a file_list
    process_files "${file_list[@]}"
    ;;
  3)
    echo "Enter the directory path to convert files from:"
    read dir_path
    if [ -d "$dir_path" ]; then
      mapfile -t files < <(find "$dir_path" -name "*.js" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/backups/*")
      process_files "${files[@]}"
    else
      echo -e "${RED}Directory not found:${NC} $dir_path"
      exit 1
    fi
    ;;
  *)
    echo -e "${RED}Invalid choice.${NC}"
    exit 1
    ;;
esac

echo -e "\n${BLUE}Next steps:${NC}"
echo "1. Review the converted files and fix any TypeScript errors"
echo "2. Update imports that reference .js files to remove the extension"
echo "3. Run TypeScript type checking: npm run typecheck"
echo "4. Build and test the application"
echo -e "\nLog file saved to: ${LOG_FILE}"
