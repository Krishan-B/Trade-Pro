#!/usr/bin/env bash

# Fully automated TypeScript error fixing script
# This script will run through the entire process without requiring manual intervention

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Automated TypeScript Error Fixing =====${NC}"
echo "This script will automatically run through the TypeScript error fixing process."

# Create log directory
LOG_DIR="./typescript-fix/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/auto-fix-$(date +%Y%m%d_%H%M%S).log"

# Log function
log() {
  echo "$1" | tee -a "$LOG_FILE"
}

log "Starting automated TypeScript error fixing on $(date)"

# Function to run a script and log output
run_script() {
  local script=$1
  local description=$2
  
  log "-----------------------------------------"
  log "Running: $description"
  log "-----------------------------------------"
  
  if [ -f "$script" ]; then
    chmod +x "$script" 2>/dev/null || true
    $script | tee -a "$LOG_FILE"
    local status=${PIPESTATUS[0]}
    if [ $status -ne 0 ]; then
      log "${RED}Error running $script. Exit code: $status${NC}"
      return $status
    else
      log "${GREEN}Successfully ran $script${NC}"
    fi
  else
    log "${RED}Script not found: $script${NC}"
    return 1
  fi
}

# Step 1: Initialize the TypeScript fix environment
run_script "./scripts/start-typescript-fix.sh" "Initializing TypeScript fix environment"

# Step 2: Enhance domain types
run_script "./scripts/enhance-domain-types.sh" "Enhancing domain types"

# Step 3: Analyze TypeScript errors by module
run_script "./scripts/analyze-typescript-by-module.sh" "Analyzing TypeScript errors by module"

# Step 4: Apply automatic fixes
run_script "./scripts/typescript-auto-fix.sh" "Applying automatic TypeScript fixes"

# Step 5: Fix high-priority modules
log "${YELLOW}Starting fixes for high-priority modules...${NC}"

# Fix auth module
run_script "./scripts/fix-auth-typescript.sh" "Fixing auth module"

# Fix critical components
run_script "./scripts/fix-components-typescript.sh" "Fixing critical components"

# Step 6: Fix remaining files by module based on the priority list
log "${YELLOW}Starting fixes for remaining modules...${NC}"

# Read priority modules from module analysis
if [ -f "./typescript-fix/module-analysis.md" ]; then
  # Extract module paths from module analysis
  modules=$(grep -o "src/[a-zA-Z0-9_/]*" ./typescript-fix/module-analysis.md | sort | uniq)
  
  for module in $modules; do
    log "${BLUE}Fixing module: $module${NC}"
    
    # Find TypeScript files in this module
    ts_files=$(find "./$module" -name "*.ts" -o -name "*.tsx" 2>/dev/null || true)
    
    # Process each file
    for file in $ts_files; do
      if [ -f "$file" ]; then
        log "Processing $file"
        
        # Backup the file
        backup_dir="./typescript-fix/backups/$(dirname "$file" | sed 's|./src/||')"
        mkdir -p "$backup_dir"
        cp "$file" "$backup_dir/$(basename "$file").bak"
        
        # Apply ESLint fixes
        npx eslint --config ./config/eslint/index.js "$file" --fix || true
        
        # Replace 'any' with 'unknown' as an intermediate step
        if grep -q "any" "$file"; then
          log "Replacing 'any' with 'unknown' in $file"
          sed -i 's/any/unknown/g' "$file"
        fi
        
        # Additional fixes for common patterns
        # Fix no-floating-promises
        if grep -q "no-floating-promises" "$file"; then
          log "Fixing floating promises in $file"
          # This is a simple approach - may need manual review
          sed -i 's/^\(\s*\)\(await\)\?[a-zA-Z0-9_]*(/\1void \2/g' "$file"
        fi
      fi
    done
  done
else
  log "${RED}Module analysis file not found. Skipping module-based fixes.${NC}"
fi

# Step 7: Update progress tracking
run_script "./scripts/typescript-daily-check.sh" "Updating progress tracking"

# Final analysis to see how many errors are left
log "${YELLOW}Running final error count...${NC}"
ERROR_COUNT=$(npx eslint --config ./config/eslint/index.js ./src --ext .ts,.tsx 2>&1 | grep -c "@typescript-eslint/" || echo 0)
COMPLETION=$(( (479 - ERROR_COUNT) * 100 / 479 ))

log "${GREEN}Automated TypeScript fixing completed!${NC}"
log "Initial errors: 479"
log "Remaining errors: $ERROR_COUNT"
log "Errors fixed: $((479 - ERROR_COUNT))"
log "Completion: $COMPLETION%"

log "${YELLOW}Next steps:${NC}"
log "1. Review the changes made by the automated process"
log "2. Address any remaining errors manually"
log "3. Run ./scripts/typescript-daily-check.sh to monitor progress"
log "4. Check the logs at $LOG_FILE for details of the process"

echo -e "${GREEN}Process completed! Check $LOG_FILE for full details.${NC}"
