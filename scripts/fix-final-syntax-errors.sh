#!/bin/bash

echo "===== TypeScript Final Syntax Fix ====="
echo "This script will fix remaining syntax errors in files."

# Create a backup directory
BACKUP_DIR="/workspaces/Trade-Pro/typescript-fix/syntax-fix-backups-final"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# Fix useMarketData.ts
FILE="/workspaces/Trade-Pro/src/hooks/useMarketData.ts"
if [ -f "$FILE" ]; then
  echo "Fixing $FILE"
  cp "$FILE" "$BACKUP_DIR/$(basename "$FILE").bak"
  sed -i 's/return data?.data || ;/return data?.data || [];/g' "$FILE"
fi

# Fix UI component imports with hyphens in names
UI_FILES=(
  "/workspaces/Trade-Pro/src/shared/ui/alert-dialog.tsx"
  "/workspaces/Trade-Pro/src/shared/ui/aspect-ratio.tsx"
  "/workspaces/Trade-Pro/src/shared/ui/context-menu.tsx"
  "/workspaces/Trade-Pro/src/shared/ui/dropdown-menu.tsx"
  "/workspaces/Trade-Pro/src/shared/ui/hover-card.tsx"
  "/workspaces/Trade-Pro/src/shared/ui/navigation-menu.tsx"
  "/workspaces/Trade-Pro/src/shared/ui/radio-group.tsx"
  "/workspaces/Trade-Pro/src/shared/ui/scroll-area.tsx"
  "/workspaces/Trade-Pro/src/shared/ui/toggle-group.tsx"
)

for file in "${UI_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file"
    cp "$file" "$BACKUP_DIR/$(basename "$file").bak"
    
    # Extract the component name from the file path
    component_name=$(basename "$file" .tsx | tr '-' '_')
    
    # Fix the import statement
    sed -i "s/import \* as [^\"]*-[^\"]*Primitive from \"@radix-ui\/react-[^\"]*\";/import * as ${component_name}Primitive from \"@radix-ui\/react-${component_name//_/-}\";/g" "$file"
  fi
done

echo "Fixed remaining TypeScript syntax errors. Original files were backed up to $BACKUP_DIR."
echo "Please run 'npx tsc --noEmit' to check if errors were resolved."
