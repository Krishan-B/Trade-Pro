#!/usr/bin/env bash

# Script to analyze TypeScript errors by module
# This helps prioritize which modules to fix first

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== TypeScript Module Error Analyzer =====${NC}"
echo "This script will analyze TypeScript errors by module to help prioritization."

# Create output directory
mkdir -p ./typescript-fix

# Run ESLint to get errors
echo -e "${YELLOW}Running ESLint to find errors...${NC}"
npx eslint --config ./config/eslint/index.js ./src --ext .ts,.tsx > ts-errors-full.txt || true

# Extract module information
echo -e "${YELLOW}Analyzing errors by module...${NC}"
cat > ./typescript-fix/module-analysis.md << EOL
# TypeScript Errors by Module
Generated on $(date)

## Module Error Counts
EOL

# Define common modules to look for
MODULES=(
  "auth"
  "components/analytics"
  "components/positions"
  "components/leverage"
  "components/orders"
  "hooks"
  "services"
  "features"
  "utils"
  "store"
)

# Count errors by module
for module in "${MODULES[@]}"; do
  COUNT=$(grep -c "$module" ts-errors-full.txt || echo 0)
  if [ "$COUNT" -gt 0 ]; then
    echo "- **$module**: $COUNT errors" >> ./typescript-fix/module-analysis.md
  fi
done

echo "" >> ./typescript-fix/module-analysis.md
echo "## Recommended Fix Order" >> ./typescript-fix/module-analysis.md
echo "" >> ./typescript-fix/module-analysis.md
echo "Based on dependencies and error counts:" >> ./typescript-fix/module-analysis.md
echo "" >> ./typescript-fix/module-analysis.md
echo "1. Fix core type definitions (`src/types/`)" >> ./typescript-fix/module-analysis.md
echo "2. Fix utility functions (`src/utils/`)" >> ./typescript-fix/module-analysis.md
echo "3. Fix services layer (`src/services/`)" >> ./typescript-fix/module-analysis.md
echo "4. Fix hooks (`src/hooks/`)" >> ./typescript-fix/module-analysis.md
echo "5. Fix state management (`src/store/`)" >> ./typescript-fix/module-analysis.md
echo "6. Fix components by priority:" >> ./typescript-fix/module-analysis.md
echo "   - Auth components" >> ./typescript-fix/module-analysis.md
echo "   - Position components" >> ./typescript-fix/module-analysis.md
echo "   - Analytics components" >> ./typescript-fix/module-analysis.md
echo "   - Remaining components" >> ./typescript-fix/module-analysis.md

# Find specific high-error files
echo -e "${YELLOW}Finding specific high-error files...${NC}"
echo "" >> ./typescript-fix/module-analysis.md
echo "## Top 10 Files with Most Errors" >> ./typescript-fix/module-analysis.md
echo "" >> ./typescript-fix/module-analysis.md

grep -E "^[^:]+\.(ts|tsx):" ts-errors-full.txt | cut -d':' -f1 | sort | uniq -c | sort -nr | head -10 | while read count file; do
  echo "- **$file**: $count errors" >> ./typescript-fix/module-analysis.md
done

# Create module-specific fix plan
echo -e "${YELLOW}Creating module-specific fix plan...${NC}"
cat > ./typescript-fix/fix-plan.md << EOL
# TypeScript Fix Plan by Module

## Phase 1: Core Types (1-2 days)
- Enhance \`src/types/domain.ts\` with additional types needed
- Create utility types for API responses
- Create proper error types

## Phase 2: Utilities and Services (2-3 days)
- Fix \`src/utils/\` directory files
- Address \`src/services/\` directory issues
- Focus on error handling and API clients

## Phase 3: Auth & Core Components (3-4 days)
- Fix \`src/features/auth/\` module issues
- Address high-priority components:
  - \`src/components/analytics/LeverageAnalytics.tsx\`
  - \`src/components/positions/PositionDetailsModal.tsx\`
  - \`src/components/leverage/MarginTracker.tsx\`

## Phase 4: Hooks and State Management (2-3 days)
- Fix custom hooks
- Address state management issues

## Phase 5: Remaining Components (3-5 days)
- Fix all remaining component issues
- Final type-checking pass
EOL

# Clean up
rm ts-errors-full.txt

echo -e "${GREEN}Analysis complete!${NC}"
echo -e "${YELLOW}Results:${NC}"
echo "- Module analysis: ./typescript-fix/module-analysis.md"
echo "- Fix plan: ./typescript-fix/fix-plan.md"

echo -e "${GREEN}Next steps:${NC}"
echo "1. Review the module analysis to understand where errors are concentrated"
echo "2. Follow the fix plan to address issues in a structured way"
echo "3. Start with core types and utilities"
echo "4. Run the typescript-daily-check.sh script to track progress"
