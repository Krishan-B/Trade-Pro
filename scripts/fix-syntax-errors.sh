#!/bin/bash

echo "===== TypeScript Syntax Error Auto-Fixer ====="
echo "This script will fix common syntax errors in TypeScript files."

# Create a backup directory
BACKUP_DIR="/workspaces/Trade-Pro/typescript-fix/syntax-fix-backups"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# 1. Fix import statements with "import * from" to proper "import * as React from"
echo "Fixing import * syntax errors..."

# Loop through files with this error pattern
find_output=$(find /workspaces/Trade-Pro/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "import \* from" {} \;)

for file in $find_output; do
  echo "Processing $file"
  # Create backup
  cp "$file" "$BACKUP_DIR/$(basename "$file").bak"
  
  # Fix React imports
  sed -i 's/import \* from "react";/import * as React from "react";/g' "$file"
  
  # Fix other common imports
  sed -i 's/import \* from "@radix-ui\/react-\([^"]*\)";/import * as \1Primitive from "@radix-ui\/react-\1";/g' "$file"
  sed -i 's/import \* from "@sentry\/browser";/import * as Sentry from "@sentry\/browser";/g' "$file"
  sed -i 's/import \* from "recharts";/import * as Recharts from "recharts";/g' "$file"
  sed -i 's/import \* from "csstype";/import * as CSS from "csstype";/g' "$file"
  sed -i 's/import \* from "\.\/";/import * as React from "\.\/";/g' "$file"
  sed -i 's/import \* from "react-resizable-panels";/import * as ResizablePanels from "react-resizable-panels";/g' "$file"
done

# 2. Fix array access expressions without arguments
echo "Fixing array access expressions without arguments..."

# List of files with this error pattern
array_error_files=(
  "/workspaces/Trade-Pro/src/features/analytics/components/TradingAnalytics.tsx"
  "/workspaces/Trade-Pro/src/features/trading/components/PositionsList.tsx"
  "/workspaces/Trade-Pro/src/hooks/useKYC.ts"
  "/workspaces/Trade-Pro/src/hooks/useMarketData.ts"
  "/workspaces/Trade-Pro/src/hooks/useWatchlistData.ts"
  "/workspaces/Trade-Pro/src/services/positionTrackingService.ts"
)

for file in "${array_error_files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file"
    # Create backup
    cp "$file" "$BACKUP_DIR/$(basename "$file").bak"
    
    # Fix empty array access expressions
    sed -i 's/\[\];/;/g' "$file"
    sed -i 's/orders\[\]/orders/g' "$file"
    sed -i 's/positions\[\]/positions/g' "$file"
    sed -i 's/data\[\]/data/g' "$file"
    sed -i 's/(data || \[\])\[\]/(data || \[\])/g' "$file"
    sed -i 's/existingData\[\]/existingData/g' "$file"
    sed -i 's/refreshedData\[\]/refreshedData/g' "$file"
  else
    echo "Warning: File $file not found"
  fi
done

# 3. Fix leverageUtils.ts with typeof issue
echo "Fixing leverageUtils.ts typeof syntax error..."
LEVERAGE_UTILS_FILE="/workspaces/Trade-Pro/src/utils/leverageUtils.ts"
if [ -f "$LEVERAGE_UTILS_FILE" ]; then
  cp "$LEVERAGE_UTILS_FILE" "$BACKUP_DIR/$(basename "$LEVERAGE_UTILS_FILE").bak"
  sed -i 's/FIXED_LEVERAGE\[normalizedType typeof FIXED_LEVERAGE\]/FIXED_LEVERAGE[normalizedType] || Object.values(FIXED_LEVERAGE)[0]/g' "$LEVERAGE_UTILS_FILE"
fi

# 4. Fix chart.tsx with typeof issues
CHART_FILE="/workspaces/Trade-Pro/src/shared/ui/chart.tsx"
if [ -f "$CHART_FILE" ]; then
  cp "$CHART_FILE" "$BACKUP_DIR/$(basename "$CHART_FILE").bak"
  sed -i 's/itemConfig\.theme\?\.\[theme typeof itemConfig\.theme\]/itemConfig?.theme?.[theme]/g' "$CHART_FILE"
  sed -i 's/payload\[key typeof payload\]/payload[key]/g' "$CHART_FILE"
  sed -i 's/payloadPayload\[key typeof payloadPayload\]/payloadPayload[key]/g' "$CHART_FILE"
  sed -i 's/key typeof payloadPayload/key/g' "$CHART_FILE"
  sed -i 's/payload\[\]/payload/g' "$CHART_FILE"
fi

# 5. Fix errorHandling.ts
ERROR_HANDLING_FILE="/workspaces/Trade-Pro/src/shared/services/errorHandling.ts"
if [ -f "$ERROR_HANDLING_FILE" ]; then
  cp "$ERROR_HANDLING_FILE" "$BACKUP_DIR/$(basename "$ERROR_HANDLING_FILE").bak"
  sed -i 's/const error = new Error(options\.title) & { description?: string };/const error = new Error(options.title) as Error \& { description?: string };/g' "$ERROR_HANDLING_FILE"
fi

echo "Fixed common TypeScript syntax errors. Original files were backed up to $BACKUP_DIR."
echo "Please run 'npx tsc --noEmit' to check if errors were resolved."
