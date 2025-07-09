#!/bin/bash

# Function to check if a file is a React component or hook
is_react_file() {
  local file=$1
  grep -l "React\.\|useRef\|forwardRef\|createContext\|createElement\|return.*<.*>.*<\/.*>" "$file" > /dev/null
}

# Function to process a TypeScript/TSX file
process_file() {
  local file=$1
  
  # Check if file needs React import
  if is_react_file "$file"; then
    # This file uses React features - keep the import but normalize it
    if grep -q "^import React" "$file"; then
      if ! grep -q "React\." "$file"; then
        # File has React import but doesn't use namespace - convert to import usage
        sed -i 's/import \* as React from "react";/import React from "react";/' "$file"
        sed -i 's/import React, { \(.*\) } from "react";/import React, { \1 } from "react";/' "$file"
      fi
    fi
  else
    # This file doesn't need React - remove the import
    echo "Removing unnecessary React import from $file"
    sed -i '/^import React from "react";$/d' "$file"
    sed -i '/^import \* as React from "react";$/d' "$file"
    sed -i 's/import React, { \(.*\) } from "react";/import { \1 } from "react";/' "$file"
    sed -i 's/, React//' "$file"
  fi
}

# Find and process all TypeScript and TSX files
find src -type f \( -name "*.tsx" -o -name "*.ts" \) -print0 | while IFS= read -r -d $'\0' file; do
  echo "Processing $file..."
  process_file "$file"
done
