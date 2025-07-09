#!/bin/bash

# Function to process a TypeScript/TSX file
process_file() {
  local file=$1
  
  # Check if the file contains JSX but doesn't use React namespace features
  if grep -q "return.*<.*>.*</.*>" "$file" && ! grep -q "React\." "$file"; then
    # Remove standalone React imports
    sed -i '/^import React from "react";$/d' "$file"
    sed -i '/^import \* as React from "react";$/d' "$file"
    
    # Remove React from multi-imports where it's unused
    sed -i 's/import React, { \(.*\) } from "react";/import { \1 } from "react";/' "$file"
    sed -i 's/React, //' "$file"
  fi
}

# Find all TypeScript/TSX files and process them
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -print0 | while IFS= read -r -d $'\0' file; do
  process_file "$file"
done

echo "React imports cleanup complete."
