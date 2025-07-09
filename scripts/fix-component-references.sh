#!/bin/bash

echo "===== Component References Fix Script ====="
echo "This script will update component references to match the new import syntax."

# Create a backup directory with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/workspaces/Trade-Pro/typescript-fix/component-refs-backups-$TIMESTAMP"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# Create a log file
LOG_DIR="/workspaces/Trade-Pro/typescript-fix/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/component-ref-fixes-$TIMESTAMP.log"

echo "Starting component reference fixes..." | tee -a "$LOG_FILE"

# Function to fix component references in a file
fix_component_refs() {
  local file=$1
  local component_name=$2
  local primitive_name=$3
  
  # Skip if file doesn't exist
  if [ ! -f "$file" ]; then
    echo "File not found: $file" | tee -a "$LOG_FILE"
    return
  fi
  
  echo "Processing $file..." | tee -a "$LOG_FILE"
  
  # Create backup
  cp "$file" "$BACKUP_DIR/$(basename "$file").bak"
  
  # Check if the file contains any references to the component without the primitive suffix
  if grep -q "${component_name}\." "$file"; then
    echo "  - Found references to ${component_name} in $file" | tee -a "$LOG_FILE"
    # Replace references like "Accordion." with "AccordionPrimitive."
    sed -i "s/${component_name}\./${primitive_name}\./g" "$file"
    echo "  - Updated references from ${component_name}. to ${primitive_name}." | tee -a "$LOG_FILE"
  fi
}

# Map of components and their primitive names
declare -A COMPONENT_MAP
COMPONENT_MAP["Accordion"]="AccordionPrimitive"
COMPONENT_MAP["AlertDialog"]="AlertDialogPrimitive"
COMPONENT_MAP["AspectRatio"]="AspectRatioPrimitive"
COMPONENT_MAP["ContextMenu"]="ContextMenuPrimitive"
COMPONENT_MAP["Dialog"]="DialogPrimitive"
COMPONENT_MAP["DropdownMenu"]="DropdownMenuPrimitive"
COMPONENT_MAP["HoverCard"]="HoverCardPrimitive"
COMPONENT_MAP["NavigationMenu"]="NavigationMenuPrimitive"
COMPONENT_MAP["Progress"]="ProgressPrimitive"
COMPONENT_MAP["RadioGroup"]="RadioGroupPrimitive"
COMPONENT_MAP["ScrollArea"]="ScrollAreaPrimitive"
COMPONENT_MAP["Select"]="SelectPrimitive"
COMPONENT_MAP["Separator"]="SeparatorPrimitive"
COMPONENT_MAP["Slider"]="SliderPrimitive"
COMPONENT_MAP["Switch"]="SwitchPrimitive"
COMPONENT_MAP["Tabs"]="TabsPrimitive"
COMPONENT_MAP["Toast"]="ToastPrimitive"
COMPONENT_MAP["ToggleGroup"]="ToggleGroupPrimitive"
COMPONENT_MAP["Tooltip"]="TooltipPrimitive"

# Find all UI component files
UI_FILES=$(find "/workspaces/Trade-Pro/src" -type f -name "*.tsx" | grep -v "node_modules")

# Process each file
for file in $UI_FILES; do
  for component in "${!COMPONENT_MAP[@]}"; do
    primitive="${COMPONENT_MAP[$component]}"
    fix_component_refs "$file" "$component" "$primitive"
  done
done

echo "Component reference fixes complete." | tee -a "$LOG_FILE"
echo "Original files were backed up to $BACKUP_DIR" | tee -a "$LOG_FILE"
echo "Log saved to $LOG_FILE"
echo ""
echo "Next steps:"
echo "1. Run 'npx tsc --skipLibCheck --noEmit' to check for remaining TypeScript errors"
echo "2. Run 'npx eslint --fix src --ext .ts,.tsx' to fix remaining ESLint errors"
