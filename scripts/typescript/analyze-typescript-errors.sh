#!/usr/bin/env bash

# TypeScript error analysis and fixing helper script
# This script helps identify TypeScript errors by category and suggests fixes

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== TypeScript Error Analyzer =====${NC}"
echo "This script will analyze TypeScript errors and group them by category."

# Directory to analyze (default: src)
DIR=${1:-src}
ERROR_REPORT="typescript-errors-report.md"

echo -e "${YELLOW}Analyzing $DIR directory...${NC}"

# Run ESLint with TypeScript rules
npx eslint --config ./config/eslint/index.js $DIR --ext .ts,.tsx > ts-errors.txt || true

# Count errors by type
echo -e "${BLUE}Counting errors by type...${NC}"
echo "# TypeScript Error Report" > $ERROR_REPORT
echo "Generated on $(date)" >> $ERROR_REPORT
echo "" >> $ERROR_REPORT
echo "## Error Summary by Type" >> $ERROR_REPORT

# Top error types
echo -e "${YELLOW}Top error types:${NC}"
grep -o "@typescript-eslint/[a-zA-Z0-9_-]*" ts-errors.txt | sort | uniq -c | sort -nr | tee /tmp/error-types.txt

# Add to report
cat /tmp/error-types.txt | while read count type; do
  echo "- **$type**: $count occurrences" >> $ERROR_REPORT
done

echo "" >> $ERROR_REPORT
echo "## Files with Most Errors" >> $ERROR_REPORT

# Files with most errors
echo -e "${YELLOW}Files with most errors:${NC}"
grep -E "^[^:]+\.(ts|tsx):" ts-errors.txt | cut -d':' -f1 | sort | uniq -c | sort -nr | head -10 | tee /tmp/error-files.txt

# Add to report
cat /tmp/error-files.txt | while read count file; do
  echo "- **$file**: $count errors" >> $ERROR_REPORT
done

# Function to get examples of each error type
echo "" >> $ERROR_REPORT
echo "## Error Examples by Type" >> $ERROR_REPORT

# Get top 5 error types
top_errors=$(grep -o "@typescript-eslint/[a-zA-Z0-9_-]*" ts-errors.txt | sort | uniq -c | sort -nr | head -5 | awk '{print $2}')

for error_type in $top_errors; do
  echo "" >> $ERROR_REPORT
  echo "### $error_type" >> $ERROR_REPORT
  echo '```typescript' >> $ERROR_REPORT
  grep -A 2 -B 2 "$error_type" ts-errors.txt | head -10 >> $ERROR_REPORT
  echo '```' >> $ERROR_REPORT
  
  # Add recommendations
  echo "" >> $ERROR_REPORT
  echo "#### Recommendations for fixing $error_type:" >> $ERROR_REPORT
  
  case $error_type in
    "@typescript-eslint/no-unsafe-assignment")
      echo "- Replace \`any\` type with proper interface or type" >> $ERROR_REPORT
      echo "- Add type guards to validate the data shape" >> $ERROR_REPORT
      echo "- Use proper typing for API responses" >> $ERROR_REPORT
      ;;
    "@typescript-eslint/no-unsafe-member-access")
      echo "- Add type guards before accessing properties" >> $ERROR_REPORT
      echo "- Define proper interfaces for objects" >> $ERROR_REPORT
      echo "- Use optional chaining (\`?.\`) when appropriate" >> $ERROR_REPORT
      ;;
    "@typescript-eslint/no-floating-promises")
      echo "- Add \`await\` keyword to promise calls" >> $ERROR_REPORT
      echo "- Add \`.catch()\` error handling" >> $ERROR_REPORT
      echo "- Use \`void\` operator for intentionally unhandled promises: \`void promise()\`" >> $ERROR_REPORT
      ;;
    "@typescript-eslint/no-misused-promises")
      echo "- Extract async logic to a separate function" >> $ERROR_REPORT
      echo "- Convert promise-returning event handlers to synchronous functions that call async functions" >> $ERROR_REPORT
      echo "- Use proper typing for event handlers" >> $ERROR_REPORT
      ;;
    "@typescript-eslint/no-unsafe-return")
      echo "- Add proper return type to the function" >> $ERROR_REPORT
      echo "- Add type guards before returning values" >> $ERROR_REPORT
      echo "- Transform any-typed values to typed values before returning" >> $ERROR_REPORT
      ;;
    *)
      echo "- Review TypeScript documentation for this rule" >> $ERROR_REPORT
      echo "- Consider adding more specific types" >> $ERROR_REPORT
      ;;
  esac
done

echo -e "${GREEN}Report generated: $ERROR_REPORT${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the report to understand error patterns"
echo "2. Start fixing highest frequency errors first"
echo "3. Focus on files with most errors"
echo "4. Rerun this script to track progress"

# Clean up
rm ts-errors.txt
rm /tmp/error-types.txt
rm /tmp/error-files.txt

echo -e "${GREEN}Done!${NC}"
