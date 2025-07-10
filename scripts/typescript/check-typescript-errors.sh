#!/bin/bash

echo "===== TypeScript Error Checker ====="
echo "This script checks TypeScript errors in your own code while ignoring third-party libraries."

# Create a log file
LOG_DIR="/workspaces/Trade-Pro/typescript-fix/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/typescript-check-$(date +%Y%m%d%H%M%S).log"

echo "Running TypeScript check with skipLibCheck..." | tee -a "$LOG_FILE"

# Count files with TypeScript errors, excluding node_modules
errors=$(npx tsc --skipLibCheck --noEmit 2>&1 | grep -v "node_modules" | grep -E "error TS[0-9]+" | wc -l)

if [ "$errors" -eq "0" ]; then
  echo "✅ No TypeScript errors found in your code!" | tee -a "$LOG_FILE"
  echo "Note: Errors in node_modules were ignored with skipLibCheck." | tee -a "$LOG_FILE"
else
  echo "❌ Found $errors TypeScript errors in your code." | tee -a "$LOG_FILE"
  echo "Running TypeScript to show your code errors..." | tee -a "$LOG_FILE"
  
  # Run TypeScript and filter out node_modules errors
  npx tsc --skipLibCheck --noEmit 2>&1 | grep -v "node_modules" | tee -a "$LOG_FILE"
fi

echo "Check complete. Log saved to $LOG_FILE"
