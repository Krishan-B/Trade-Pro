#!/usr/bin/env bash

# TypeScript Error Fix Workflow
# This script guides you through a complete workflow for fixing TypeScript errors

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== TypeScript Error Fix Workflow =====${NC}"
echo "This script will guide you through the process of fixing TypeScript errors."

# Create working directory
mkdir -p ./typescript-fix

# Step 1: Run TypeScript analysis
echo -e "${YELLOW}Step 1: Running TypeScript error analysis...${NC}"
./scripts/analyze-typescript-errors.sh
echo -e "${GREEN}✓ Analysis complete${NC}"

# Step 2: Enhance domain types
echo -e "${YELLOW}Step 2: Enhancing domain types...${NC}"
./scripts/enhance-domain-types.sh
echo -e "${GREEN}✓ Domain types enhanced${NC}"

# Step 3: Analyze errors by module
echo -e "${YELLOW}Step 3: Analyzing errors by module...${NC}"
./scripts/analyze-typescript-by-module.sh
echo -e "${GREEN}✓ Module analysis complete${NC}"

# Step 4: Run initial auto-fixes
echo -e "${YELLOW}Step 4: Running initial auto-fixes...${NC}"
./scripts/typescript-auto-fix.sh
echo -e "${GREEN}✓ Initial auto-fixes applied${NC}"

# Step 5: Fix high-priority modules
echo -e "${YELLOW}Step 5: Fixing high-priority modules...${NC}"
echo -e "${BLUE}Would you like to fix the auth module now? (y/n)${NC}"
read -r fix_auth
if [[ $fix_auth == "y" ]]; then
  ./scripts/fix-auth-typescript.sh
  echo -e "${GREEN}✓ Auth module fixes applied${NC}"
fi

echo -e "${BLUE}Would you like to fix critical components now? (y/n)${NC}"
read -r fix_components
if [[ $fix_components == "y" ]]; then
  ./scripts/fix-components-typescript.sh
  echo -e "${GREEN}✓ Component fixes applied${NC}"
fi

# Step 6: Track progress
echo -e "${YELLOW}Step 6: Setting up progress tracking...${NC}"
./scripts/typescript-daily-check.sh
echo -e "${GREEN}✓ Progress tracking set up${NC}"

# Final instructions
echo -e "${GREEN}TypeScript error fix workflow completed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the generated reports in ./typescript-fix/"
echo "2. Continue fixing errors in high-priority modules"
echo "3. Run ./scripts/typescript-daily-check.sh daily to track progress"
echo "4. Update error handling to use the new error types"
echo "5. Replace 'any' types with the newly created types"

echo -e "${BLUE}Remember:${NC}"
echo "- Start with utility functions and services"
echo "- Fix core functionality before peripheral features"
echo "- Test thoroughly after each set of changes"
echo "- Commit changes frequently to track progress"
