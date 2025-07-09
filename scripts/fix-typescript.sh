#!/usr/bin/env bash

# Master TypeScript Fix Automation Script
# This script orchestrates the entire TypeScript fixing process

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if this script is being run with the --help flag
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
  echo -e "${GREEN}TypeScript Fix Automation${NC}"
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  --auto       Run fully automated fix process (default)"
  echo "  --batch      Run batch module-by-module fixes"
  echo "  --module     Fix a specific module (requires module name)"
  echo "  --validate   Validate the fixes"
  echo "  --help       Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0                      # Run default automated fix process"
  echo "  $0 --batch              # Run batch module fixes"
  echo "  $0 --module components/analytics  # Fix specific module"
  echo "  $0 --validate           # Validate fixes"
  exit 0
fi

echo -e "${GREEN}===== TypeScript Fix Automation =====${NC}"
echo "Starting TypeScript fix automation on $(date)"

# Process command line arguments
if [ "$1" == "--batch" ]; then
  echo -e "${YELLOW}Running batch module fixes...${NC}"
  ./scripts/batch-fix-typescript.sh
elif [ "$1" == "--module" ] && [ -n "$2" ]; then
  echo -e "${YELLOW}Fixing module: $2${NC}"
  ./scripts/fix-module.sh "$2"
elif [ "$1" == "--validate" ]; then
  echo -e "${YELLOW}Validating TypeScript fixes...${NC}"
  ./scripts/validate-typescript-fixes.sh
else
  # Default: Run full automation
  echo -e "${YELLOW}Running full automated fix process...${NC}"
  
  # Make sure all scripts are executable
  chmod +x ./scripts/start-typescript-fix.sh
  chmod +x ./scripts/enhance-domain-types.sh
  chmod +x ./scripts/analyze-typescript-by-module.sh
  chmod +x ./scripts/typescript-auto-fix.sh
  chmod +x ./scripts/fix-auth-typescript.sh
  chmod +x ./scripts/fix-components-typescript.sh
  chmod +x ./scripts/typescript-daily-check.sh
  chmod +x ./scripts/auto-fix-typescript.sh
  
  # Run the auto-fix script
  ./scripts/auto-fix-typescript.sh
  
  # Validate the fixes
  echo -e "${YELLOW}Validating fixes...${NC}"
  ./scripts/validate-typescript-fixes.sh
fi

echo -e "${GREEN}TypeScript fix automation completed at $(date)!${NC}"
echo -e "${BLUE}Check the logs in ./typescript-fix/logs/ for details.${NC}"
