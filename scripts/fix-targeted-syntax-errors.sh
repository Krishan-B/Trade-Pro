#!/bin/bash

echo "===== TypeScript Targeted Syntax Error Auto-Fixer ====="
echo "This script will fix specific syntax errors in known problematic files."

# Create a backup directory
BACKUP_DIR="/workspaces/Trade-Pro/typescript-fix/syntax-fix-backups"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# Fix array access expressions without arguments
echo "Fixing array access expressions without arguments..."

# Fix TradingAnalytics.tsx
FILE="/workspaces/Trade-Pro/src/features/analytics/components/TradingAnalytics.tsx"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/setOrders(orders\[\]);/setOrders(orders);/g' "$FILE"
  sed -i 's/setPositions(positions\[\]);/setPositions(positions);/g' "$FILE"
fi

# Fix PositionsList.tsx
FILE="/workspaces/Trade-Pro/src/features/trading/components/PositionsList.tsx"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/setPositions(data\[\]);/setPositions(data);/g' "$FILE"
fi

# Fix useKYC.ts
FILE="/workspaces/Trade-Pro/src/hooks/useKYC.ts"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/setDocuments((data || \[\])\[\]);/setDocuments(data || []);/g' "$FILE"
fi

# Fix useMarketData.ts
FILE="/workspaces/Trade-Pro/src/hooks/useMarketData.ts"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/return existingData\[\];/return existingData;/g' "$FILE"
fi

# Fix useWatchlistData.ts
FILE="/workspaces/Trade-Pro/src/hooks/useWatchlistData.ts"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/return data\[\];/return data;/g' "$FILE"
  sed -i 's/return refreshedData\[\];/return refreshedData;/g' "$FILE"
fi

# Fix positionTrackingService.ts
FILE="/workspaces/Trade-Pro/src/services/positionTrackingService.ts"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/return (data || \[\])\[\];/return (data || []);/g' "$FILE"
fi

# Fix import statements for specific files
echo "Fixing import statements..."

# Fix MobileMenu.tsx
FILE="/workspaces/Trade-Pro/src/features/navigation/components/MobileMenu.tsx"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/import \* from "react";/import * as React from "react";/g' "$FILE"
fi

# Fix MobileNavItem.tsx
FILE="/workspaces/Trade-Pro/src/features/navigation/components/MobileNavItem.tsx"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/import \* from "react";/import * as React from "react";/g' "$FILE"
fi

# Fix use-toast.ts
FILE="/workspaces/Trade-Pro/src/hooks/use-toast.ts"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/import \* from "react";/import * as React from "react";/g' "$FILE"
fi

# Fix sentry.client.ts
FILE="/workspaces/Trade-Pro/src/sentry.client.ts"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/import \* from "@sentry\/browser";/import * as Sentry from "@sentry\/browser";/g' "$FILE"
fi

# Fix shared/ui component imports
UI_DIR="/workspaces/Trade-Pro/src/shared/ui"
if [ -d "$UI_DIR" ]; then
  echo "Fixing UI components..."
  
  # Find all UI component files
  UI_FILES=$(find "$UI_DIR" -type f -name "*.tsx")
  
  for file in $UI_FILES; do
    echo "Processing $file"
    cp "$file" "$BACKUP_DIR/$(basename "$file").bak"
    
    # Fix React imports
    sed -i 's/import \* from "react";/import * as React from "react";/g' "$file"
    
    # Fix Radix UI imports
    sed -i 's/import \* from "@radix-ui\/react-\([^"]*\)";/import * as \1Primitive from "@radix-ui\/react-\1";/g' "$file"
    
    # Fix Recharts imports
    sed -i 's/import \* from "recharts";/import * as Recharts from "recharts";/g' "$file"
    
    # Fix ResizablePanels imports
    sed -i 's/import \* from "react-resizable-panels";/import * as ResizablePanels from "react-resizable-panels";/g' "$file"
  done
fi

# Fix leverageUtils.ts with typeof issue
echo "Fixing leverageUtils.ts typeof syntax error..."
FILE="/workspaces/Trade-Pro/src/utils/leverageUtils.ts"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/FIXED_LEVERAGE\[normalizedType typeof FIXED_LEVERAGE\]/FIXED_LEVERAGE[normalizedType]/g' "$FILE"
fi

# Fix chart.tsx with typeof issues
FILE="/workspaces/Trade-Pro/src/shared/ui/chart.tsx"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/itemConfig.theme?.\[theme typeof itemConfig.theme\]/itemConfig?.theme?.[theme]/g' "$FILE"
  sed -i 's/typeof payload\[key typeof payload\]/typeof payload[key]/g' "$FILE"
  sed -i 's/typeof payloadPayload\[key typeof payloadPayload\]/typeof payloadPayload[key]/g' "$FILE"
  sed -i 's/key typeof payloadPayload/key/g' "$FILE"
  sed -i 's/payload\[\]/payload/g' "$FILE"
fi

# Fix errorHandling.ts
FILE="/workspaces/Trade-Pro/src/shared/services/errorHandling.ts"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/const error = new Error(options.title) & { description?: string };/const error = new Error(options.title) as Error \& { description?: string };/g' "$FILE"
fi

echo "Fixed common TypeScript syntax errors. Original files were backed up to $BACKUP_DIR."
echo "Please run 'npx tsc --noEmit' to check if errors were resolved."
