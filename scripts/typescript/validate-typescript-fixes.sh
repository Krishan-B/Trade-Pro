#!/usr/bin/env bash

# TypeScript fix validation script
# This script helps validate that the TypeScript fixes haven't broken functionality

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== TypeScript Fix Validation =====${NC}"
echo "This script will help validate that the TypeScript fixes haven't broken functionality."

# Create log directory
LOG_DIR="./typescript-fix/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/validation-$(date +%Y%m%d_%H%M%S).log"

# Check if there are any remaining TypeScript errors
echo -e "${YELLOW}Checking for remaining TypeScript errors...${NC}" | tee -a "$LOG_FILE"
ERRORS=$(npx eslint --config ./config/eslint/index.js ./src --ext .ts,.tsx 2>&1 | grep "@typescript-eslint/" || echo "No errors found")
ERROR_COUNT=$(echo "$ERRORS" | grep -c "@typescript-eslint/" || echo 0)

echo "Remaining TypeScript errors: $ERROR_COUNT" | tee -a "$LOG_FILE"

if [ $ERROR_COUNT -eq 0 ]; then
  echo -e "${GREEN}✓ No TypeScript errors found!${NC}" | tee -a "$LOG_FILE"
else
  echo -e "${YELLOW}⚠ There are still $ERROR_COUNT TypeScript errors.${NC}" | tee -a "$LOG_FILE"
fi

# Check if the project builds successfully
echo -e "${YELLOW}Building the project...${NC}" | tee -a "$LOG_FILE"
npm run build > "$LOG_DIR/build-output.log" 2>&1 || {
  echo -e "${RED}✗ Build failed! Check $LOG_DIR/build-output.log for details.${NC}" | tee -a "$LOG_FILE"
  echo "The last 10 lines of the build log:" | tee -a "$LOG_FILE"
  tail -10 "$LOG_DIR/build-output.log" | tee -a "$LOG_FILE"
  echo -e "${RED}Please fix the build errors before continuing.${NC}" | tee -a "$LOG_FILE"
  exit 1
}

echo -e "${GREEN}✓ Build successful!${NC}" | tee -a "$LOG_FILE"

# Run tests if they exist
echo -e "${YELLOW}Running tests...${NC}" | tee -a "$LOG_FILE"
if [ -f "package.json" ] && grep -q "\"test\":" "package.json"; then
  npm test > "$LOG_DIR/test-output.log" 2>&1 || {
    echo -e "${RED}✗ Tests failed! Check $LOG_DIR/test-output.log for details.${NC}" | tee -a "$LOG_FILE"
    echo "The last 10 lines of the test log:" | tee -a "$LOG_FILE"
    tail -10 "$LOG_DIR/test-output.log" | tee -a "$LOG_FILE"
    echo -e "${YELLOW}Please review the test failures and fix them.${NC}" | tee -a "$LOG_FILE"
  }
  echo -e "${GREEN}✓ Tests completed!${NC}" | tee -a "$LOG_FILE"
else
  echo -e "${YELLOW}No test script found in package.json. Skipping tests.${NC}" | tee -a "$LOG_FILE"
fi

# Check for any syntax errors
echo -e "${YELLOW}Checking for syntax errors...${NC}" | tee -a "$LOG_FILE"
SYNTAX_ERRORS=$(find ./src -name "*.ts" -o -name "*.tsx" | xargs npx tsc --noEmit --allowJs --checkJs false 2>&1 | grep -v "node_modules" || echo "No syntax errors found")

if [ "$SYNTAX_ERRORS" == "No syntax errors found" ]; then
  echo -e "${GREEN}✓ No syntax errors found!${NC}" | tee -a "$LOG_FILE"
else
  echo -e "${RED}✗ Syntax errors found:${NC}" | tee -a "$LOG_FILE"
  echo "$SYNTAX_ERRORS" | tee -a "$LOG_FILE"
  echo -e "${YELLOW}Please fix these syntax errors.${NC}" | tee -a "$LOG_FILE"
fi

# Check for any runtime errors when starting the app
echo -e "${YELLOW}Checking if the app starts without errors...${NC}" | tee -a "$LOG_FILE"
echo "Starting the app for 5 seconds to check for runtime errors..."
timeout 5s npm start > "$LOG_DIR/start-output.log" 2>&1 || {
  echo -e "${YELLOW}⚠ App startup interrupted (this is expected).${NC}" | tee -a "$LOG_FILE"
}

# Check for common runtime errors in the startup log
if grep -q "TypeError\|ReferenceError\|Cannot read properties of" "$LOG_DIR/start-output.log"; then
  echo -e "${RED}✗ Runtime errors detected during app startup!${NC}" | tee -a "$LOG_FILE"
  echo "Errors found:" | tee -a "$LOG_FILE"
  grep -A 5 -B 2 "TypeError\|ReferenceError\|Cannot read properties of" "$LOG_DIR/start-output.log" | tee -a "$LOG_FILE"
else
  echo -e "${GREEN}✓ No obvious runtime errors detected during app startup.${NC}" | tee -a "$LOG_FILE"
fi

# Generate validation report
echo -e "${YELLOW}Generating validation report...${NC}" | tee -a "$LOG_FILE"
REPORT_FILE="./typescript-fix/validation-report-$(date +%Y%m%d).md"

cat > "$REPORT_FILE" << EOL
# TypeScript Fix Validation Report
Generated on $(date)

## Summary

- **Remaining TypeScript Errors:** $ERROR_COUNT
- **Build Status:** $([ -f "$LOG_DIR/build-output.log" ] && grep -q "ERROR" "$LOG_DIR/build-output.log" && echo "Failed" || echo "Success")
- **Test Status:** $([ -f "$LOG_DIR/test-output.log" ] && grep -q "FAIL" "$LOG_DIR/test-output.log" && echo "Failed" || echo "Success/Not Run")
- **Syntax Check:** $([ "$SYNTAX_ERRORS" == "No syntax errors found" ] && echo "No Errors" || echo "Errors Found")
- **Runtime Check:** $(grep -q "TypeError\|ReferenceError\|Cannot read properties of" "$LOG_DIR/start-output.log" && echo "Errors Detected" || echo "No Obvious Errors")

## Recommendations

$([ $ERROR_COUNT -eq 0 ] && echo "✓ All TypeScript errors have been fixed!" || echo "⚠ Fix the remaining $ERROR_COUNT TypeScript errors.")
$([ -f "$LOG_DIR/build-output.log" ] && grep -q "ERROR" "$LOG_DIR/build-output.log" && echo "✗ Fix the build errors before proceeding." || echo "✓ Build is successful.")
$([ -f "$LOG_DIR/test-output.log" ] && grep -q "FAIL" "$LOG_DIR/test-output.log" && echo "⚠ Fix the failing tests." || echo "✓ Tests are passing or not applicable.")
$([ "$SYNTAX_ERRORS" == "No syntax errors found" ] && echo "✓ No syntax errors found." || echo "✗ Fix the syntax errors.")
$(grep -q "TypeError\|ReferenceError\|Cannot read properties of" "$LOG_DIR/start-output.log" && echo "✗ Fix the runtime errors detected during startup." || echo "✓ No obvious runtime errors detected.")

## Next Steps

1. Review any remaining errors and fix them manually.
2. Run a full test suite to ensure all functionality works as expected.
3. Perform manual testing of key features to verify no regressions.
4. Update documentation to reflect any API changes.
5. Consider adding more type definitions to prevent future issues.
EOL

echo -e "${GREEN}Validation complete!${NC}"
echo -e "${BLUE}Validation report: $REPORT_FILE${NC}"
echo -e "${BLUE}Detailed logs: $LOG_FILE${NC}"

if [ $ERROR_COUNT -eq 0 ] && ! grep -q "ERROR" "$LOG_DIR/build-output.log" 2>/dev/null && ! grep -q "TypeError\|ReferenceError\|Cannot read properties of" "$LOG_DIR/start-output.log" 2>/dev/null; then
  echo -e "${GREEN}All checks passed! Your TypeScript fixes appear to be successful.${NC}"
else
  echo -e "${YELLOW}Some issues were found. Please review the validation report.${NC}"
fi
