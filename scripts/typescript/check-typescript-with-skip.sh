#!/bin/bash

echo "===== TypeScript Build with skipLibCheck ====="

# Run TypeScript compiler with skipLibCheck
npx tsc --skipLibCheck --noEmit

if [ $? -eq 0 ]; then
  echo "✅ TypeScript build succeeded with skipLibCheck!"
  echo "The TypeScript syntax errors in the code have been fixed."
else
  echo "❌ TypeScript build failed with skipLibCheck."
  echo "There are still TypeScript errors in the project."
fi
