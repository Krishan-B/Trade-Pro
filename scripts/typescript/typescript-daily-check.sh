#!/usr/bin/env bash

# Daily TypeScript error check script
# Runs analysis and updates progress tracking

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "\033[0;32m===== Daily TypeScript Error Check =====\033[0m"

# Run ESLint to get current error count
echo -e "\033[1;33mCounting current TypeScript errors...\033[0m"
ERROR_COUNT=$(npx eslint --config ./config/eslint/index.js ./src --ext .ts,.tsx 2>&1 | grep -c "@typescript-eslint/" || echo 0)

# Get previous count from progress.md
PREV_COUNT=$(grep -A 1 "Remaining Errors" ./typescript-fix/progress.md | tail -1 | awk -F'|' '{print $3}' | xargs)
if [ -z "$PREV_COUNT" ]; then
  PREV_COUNT=479 # Initial count
fi

# Calculate difference
FIXED_TODAY=$(($PREV_COUNT - $ERROR_COUNT))
if [ $FIXED_TODAY -lt 0 ]; then
  FIXED_TODAY=0
  echo -e "\033[0;31mWarning: Error count increased!\033[0m"
fi

# Update progress.md
echo -e "\033[1;33mUpdating progress tracker...\033[0m"
sed -i "/^## Progress/a | $(date +%Y-%m-%d) | $ERROR_COUNT | $FIXED_TODAY | Daily check |" ./typescript-fix/progress.md

# Calculate completion percentage
COMPLETION=$(( (479 - $ERROR_COUNT) * 100 / 479 ))

echo -e "\033[0;32mCurrent status:\033[0m"
echo "Remaining errors: $ERROR_COUNT"
echo "Fixed today: $FIXED_TODAY"
echo "Completion: $COMPLETION%"

# Update dashboard if it exists
if [ -f "./typescript-fix/dashboard.html" ]; then
  echo -e "\033[1;33mUpdating dashboard...\033[0m"
  sed -i "s/<div class=\"progress\" style=\"width: [0-9]*%\"><\/div>/<div class=\"progress\" style=\"width: ${COMPLETION}%\"><\/div>/g" ./typescript-fix/dashboard.html
  sed -i "s/<p id=\"total-errors\">[0-9]*<\/p>/<p id=\"total-errors\">479<\/p>/g" ./typescript-fix/dashboard.html
  sed -i "s/<p id=\"fixed-errors\">[0-9]*<\/p>/<p id=\"fixed-errors\">479<\/p>/g" ./typescript-fix/dashboard.html
  sed -i "s/<p id=\"remaining-errors\">[0-9]*<\/p>/<p id=\"remaining-errors\">${ERROR_COUNT}<\/p>/g" ./typescript-fix/dashboard.html
  sed -i "s/<p id=\"completion\">[0-9]*%<\/p>/<p id=\"completion\">${COMPLETION}%<\/p>/g" ./typescript-fix/dashboard.html
fi

echo -e "\033[1;33mNext steps:\033[0m"
echo "1. Continue fixing errors in priority files"
echo "2. Run './scripts/fix-auth-typescript.sh' or './scripts/fix-components-typescript.sh' to address high-priority modules"
echo "3. Run this script daily to track progress"

echo -e "\033[0;32mDone!\033[0m"
