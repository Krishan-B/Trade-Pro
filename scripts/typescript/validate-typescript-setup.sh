#!/bin/bash

# validate-typescript-setup.sh
# Script to validate the TypeScript setup after migration
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
LOG_FILE="$LOG_DIR/validate-typescript-$TIMESTAMP.log"

echo -e "${BLUE}======== TypeScript Setup Validation ========${NC}"
echo "This script will validate the TypeScript setup after migration"
echo -e "Log will be saved to: ${LOG_FILE}\n"

# Track overall success
SUCCESS=true

# Check TypeScript config
echo -e "\n${YELLOW}Checking TypeScript configuration...${NC}" | tee -a "$LOG_FILE"
if [ -f "tsconfig.json" ]; then
  echo -e "${GREEN}✓ tsconfig.json exists${NC}" | tee -a "$LOG_FILE"
  
  # Check for outDir setting
  if grep -q '"outDir"' "tsconfig.json"; then
    OUT_DIR=$(grep -o '"outDir"[[:space:]]*:[[:space:]]*"[^"]*"' "tsconfig.json" | cut -d'"' -f4)
    echo -e "${GREEN}✓ outDir is set to: $OUT_DIR${NC}" | tee -a "$LOG_FILE"
  else
    echo -e "${RED}✗ outDir not set in tsconfig.json${NC}" | tee -a "$LOG_FILE"
    SUCCESS=false
  fi
  
  # Check for strict mode
  if grep -q '"strict"[[:space:]]*:[[:space:]]*true' "tsconfig.json"; then
    echo -e "${GREEN}✓ strict mode is enabled${NC}" | tee -a "$LOG_FILE"
  else
    echo -e "${YELLOW}⚠ strict mode is not enabled${NC}" | tee -a "$LOG_FILE"
  fi
else
  echo -e "${RED}✗ tsconfig.json not found${NC}" | tee -a "$LOG_FILE"
  SUCCESS=false
fi

# Check .gitignore for proper patterns
echo -e "\n${YELLOW}Checking .gitignore file...${NC}" | tee -a "$LOG_FILE"
if [ -f ".gitignore" ]; then
  echo -e "${GREEN}✓ .gitignore exists${NC}" | tee -a "$LOG_FILE"
  
  # Check for dist directory exclusion
  if grep -q "^/dist$\|^dist/$\|^dist$" ".gitignore"; then
    echo -e "${GREEN}✓ dist directory is excluded in .gitignore${NC}" | tee -a "$LOG_FILE"
  else
    echo -e "${RED}✗ dist directory is not properly excluded in .gitignore${NC}" | tee -a "$LOG_FILE"
    SUCCESS=false
  fi
  
  # Check for JS file exclusions
  if grep -q "*.js.map\|*.js$" ".gitignore"; then
    echo -e "${GREEN}✓ JavaScript output files are excluded in .gitignore${NC}" | tee -a "$LOG_FILE"
  else
    echo -e "${YELLOW}⚠ JavaScript output files may not be properly excluded in .gitignore${NC}" | tee -a "$LOG_FILE"
  fi
else
  echo -e "${RED}✗ .gitignore not found${NC}" | tee -a "$LOG_FILE"
  SUCCESS=false
fi

# Check package.json scripts
echo -e "\n${YELLOW}Checking package.json scripts...${NC}" | tee -a "$LOG_FILE"
if [ -f "package.json" ]; then
  echo -e "${GREEN}✓ package.json exists${NC}" | tee -a "$LOG_FILE"
  
  # Check for typecheck script
  if grep -q '"typecheck"' "package.json"; then
    echo -e "${GREEN}✓ typecheck script exists in package.json${NC}" | tee -a "$LOG_FILE"
  else
    echo -e "${RED}✗ typecheck script not found in package.json${NC}" | tee -a "$LOG_FILE"
    SUCCESS=false
  fi
  
  # Check for build:clean script
  if grep -q '"build:clean"' "package.json"; then
    echo -e "${GREEN}✓ build:clean script exists in package.json${NC}" | tee -a "$LOG_FILE"
  else
    echo -e "${YELLOW}⚠ build:clean script not found in package.json${NC}" | tee -a "$LOG_FILE"
  fi
else
  echo -e "${RED}✗ package.json not found${NC}" | tee -a "$LOG_FILE"
  SUCCESS=false
fi

# Run TypeScript type checking
echo -e "\n${YELLOW}Running TypeScript type checking...${NC}" | tee -a "$LOG_FILE"
if npm run typecheck 2>&1 | tee -a "$LOG_FILE"; then
  echo -e "${GREEN}✓ TypeScript type checking passed${NC}" | tee -a "$LOG_FILE"
else
  echo -e "${RED}✗ TypeScript type checking failed${NC}" | tee -a "$LOG_FILE"
  SUCCESS=false
fi

# Summary
echo -e "\n${BLUE}======== Validation Summary ========${NC}" | tee -a "$LOG_FILE"
if [ "$SUCCESS" = true ]; then
  echo -e "${GREEN}✓ TypeScript setup is valid${NC}" | tee -a "$LOG_FILE"
else
  echo -e "${RED}✗ TypeScript setup has issues that need to be addressed${NC}" | tee -a "$LOG_FILE"
  echo -e "Please check the log file for details: ${LOG_FILE}" | tee -a "$LOG_FILE"
fi

echo -e "\n${BLUE}Recommended Next Steps:${NC}"
echo "1. Address any issues identified above"
echo "2. Convert remaining JavaScript files to TypeScript using js-to-ts-conversion.sh"
echo "3. Fix any imports referencing .js files using fix-js-imports.sh"
echo "4. Run tests to verify everything works correctly"
echo "5. Commit the changes to the repository"

# Exit with appropriate status
if [ "$SUCCESS" = true ]; then
  exit 0
else
  exit 1
fi
