#!/bin/bash
echo "Checking React imports..."

# Create a temporary directory for test files
mkdir -p temp_test

for file in $(find src -name "*.tsx"); do
  # Skip files in node_modules
  if [[ $file == *"node_modules"* ]]; then
    continue
  fi
  
  # Create a copy without React import
  grep -v "^import.*React.*from.*react" "$file" > "temp_test/$(basename "$file")"
  
  # Run TypeScript compiler on the modified file
  if ! npx tsc "temp_test/$(basename "$file")" --noEmit --jsx react-jsx 2>/dev/null; then
    echo "React import needed in: $file"
  fi
done

# Clean up
rm -rf temp_test
