#!/usr/bin/env bash

# Script to start the TypeScript error fixing process
# This script coordinates the analysis and provides a structured approach to fixing TypeScript errors

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== TypeScript Error Fix Kickstarter =====${NC}"
echo "This script will help you start addressing TypeScript issues systematically."

# Create a working directory for TypeScript fix artifacts
mkdir -p ./typescript-fix

# Step 1: Run the analysis script
echo -e "${YELLOW}Step 1: Analyzing TypeScript errors...${NC}"
./scripts/analyze-typescript-errors.sh
mv typescript-errors-report.md ./typescript-fix/

# Step 2: Generate a prioritized list of files to fix
echo -e "${YELLOW}Step 2: Generating prioritized file list...${NC}"
echo "# Prioritized Files for TypeScript Fixes" > ./typescript-fix/priority-files.md
echo "Generated on $(date)" >> ./typescript-fix/priority-files.md
echo "" >> ./typescript-fix/priority-files.md

# Extract the highest priority files from the report
echo "## Highest Priority Files (Fix First)" >> ./typescript-fix/priority-files.md
grep -A 10 "Files with Most Errors" ./typescript-fix/typescript-errors-report.md | grep -v "Files with Most Errors" | grep -v "^$" | head -10 >> ./typescript-fix/priority-files.md

# Step 3: Set up progress tracking
echo -e "${YELLOW}Step 3: Setting up progress tracking...${NC}"
cat > ./typescript-fix/progress.md << EOL
# TypeScript Fix Progress Tracker

## Initial Count
- Total errors: 479 (as of $(date))

## Progress
| Date | Remaining Errors | Fixed Today | Notes |
|------|-----------------|-------------|-------|
| $(date +%Y-%m-%d) | 479 | 0 | Initial assessment |

## Completed Files
- None yet

## In Progress
- None yet
EOL

# Step 4: Create a tracking dashboard
echo -e "${YELLOW}Step 4: Creating tracking dashboard...${NC}"
cat > ./typescript-fix/dashboard.html << EOL
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TypeScript Fix Progress</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    .header { background-color: #333; color: white; padding: 20px; margin-bottom: 20px; }
    .progress-bar { height: 20px; background-color: #f3f3f3; border-radius: 5px; margin-bottom: 20px; }
    .progress { height: 100%; background-color: #4CAF50; border-radius: 5px; }
    .stats { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .stat-box { background-color: #f9f9f9; padding: 20px; border-radius: 5px; flex: 1; margin: 0 10px; text-align: center; }
    .priority-files { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Trade-Pro TypeScript Fix Progress</h1>
  </div>
  
  <h2>Overall Progress</h2>
  <div class="progress-bar">
    <div class="progress" style="width: 0%"></div>
  </div>
  
  <div class="stats">
    <div class="stat-box">
      <h3>Total Errors</h3>
      <p id="total-errors">479</p>
    </div>
    <div class="stat-box">
      <h3>Fixed</h3>
      <p id="fixed-errors">0</p>
    </div>
    <div class="stat-box">
      <h3>Remaining</h3>
      <p id="remaining-errors">479</p>
    </div>
    <div class="stat-box">
      <h3>Completion</h3>
      <p id="completion">0%</p>
    </div>
  </div>
  
  <div class="priority-files">
    <h2>Priority Files</h2>
    <ol id="priority-files-list">
      <!-- Will be populated from the priority-files.md -->
    </ol>
  </div>
</body>
</html>
EOL

# Step 5: Create a module-specific fix script template
echo -e "${YELLOW}Step 5: Creating module-specific fix script template...${NC}"
cat > ./scripts/fix-module-typescript.sh << EOL
#!/usr/bin/env bash

# Module-specific TypeScript fix script
# Usage: ./fix-module-typescript.sh <module-name>

set -e

MODULE=\${1}

if [ -z "\$MODULE" ]; then
  echo "Usage: \$0 <module-name>"
  echo "Example: \$0 auth"
  exit 1
fi

echo "Fixing TypeScript issues in \$MODULE module..."

# Find files in the module
FILES=\$(find ./src -path "*\$MODULE*" -name "*.ts" -o -name "*.tsx")

# Run ESLint with --fix option on these files
for file in \$FILES; do
  echo "Fixing \$file..."
  npx eslint --config ./config/eslint/index.js "\$file" --fix || true
done

# Check remaining errors
echo "Checking remaining errors..."
npx eslint --config ./config/eslint/index.js \$FILES

echo "Done! Please review changes and fix any remaining issues manually."
EOL

# Make the scripts executable
chmod +x ./scripts/fix-module-typescript.sh

# Step 6: Add high-priority module fix script
echo -e "${YELLOW}Step 6: Creating specific fix scripts for high-priority modules...${NC}"
cat > ./scripts/fix-auth-typescript.sh << EOL
#!/usr/bin/env bash

# Script to fix TypeScript issues in the auth module
# This is a high-priority module based on error analysis

set -e

echo "Fixing TypeScript issues in Auth module..."

# Find auth module files
AUTH_FILES=\$(find ./src/features/auth -name "*.ts" -o -name "*.tsx")

# Backup files before modification
BACKUP_DIR="./typescript-fix/backups/auth/\$(date +%Y%m%d_%H%M%S)"
mkdir -p "\$BACKUP_DIR"
for file in \$AUTH_FILES; do
  DIR_STRUCTURE=\$(dirname "\$file" | sed 's|./src/||')
  mkdir -p "\$BACKUP_DIR/\$DIR_STRUCTURE"
  cp "\$file" "\$BACKUP_DIR/\$DIR_STRUCTURE/\$(basename "\$file")"
done

# Run auto-fixes
echo "Running auto-fixes..."
npx eslint --config ./config/eslint/index.js \$AUTH_FILES --fix || true

# Specific fixes for AuthProvider.tsx (one of the highest error files)
AUTH_PROVIDER="./src/features/auth/context/AuthProvider.tsx"
if [ -f "\$AUTH_PROVIDER" ]; then
  echo "Applying specific fixes to AuthProvider.tsx..."
  
  # Replace 'any' types with proper types from domain.ts
  sed -i 's/any/unknown/g' "\$AUTH_PROVIDER"
  
  # Check if fixes were applied
  if grep -q "unknown" "\$AUTH_PROVIDER"; then
    echo "Replaced 'any' with 'unknown' as an intermediate step. Manual review required."
  fi
fi

echo "Auth module fixes applied. Please review changes and address remaining issues manually."
EOL

chmod +x ./scripts/fix-auth-typescript.sh

# Create a script for fixing the components module
cat > ./scripts/fix-components-typescript.sh << EOL
#!/usr/bin/env bash

# Script to fix TypeScript issues in critical components
# Focuses on highest-error components identified in analysis

set -e

echo "Fixing TypeScript issues in critical components..."

# Critical components based on error analysis
COMPONENTS=(
  "./src/components/analytics/LeverageAnalytics.tsx"
  "./src/components/positions/PositionDetailsModal.tsx"
  "./src/components/leverage/MarginTracker.tsx"
)

# Backup files before modification
BACKUP_DIR="./typescript-fix/backups/components/\$(date +%Y%m%d_%H%M%S)"
mkdir -p "\$BACKUP_DIR"
for file in "\${COMPONENTS[@]}"; do
  if [ -f "\$file" ]; then
    DIR_STRUCTURE=\$(dirname "\$file" | sed 's|./src/||')
    mkdir -p "\$BACKUP_DIR/\$DIR_STRUCTURE"
    cp "\$file" "\$BACKUP_DIR/\$DIR_STRUCTURE/\$(basename "\$file")"
  fi
done

# Run auto-fixes
echo "Running auto-fixes..."
for file in "\${COMPONENTS[@]}"; do
  if [ -f "\$file" ]; then
    echo "Fixing \$file..."
    npx eslint --config ./config/eslint/index.js "\$file" --fix || true
  fi
done

echo "Component fixes applied. Please review changes and address remaining issues manually."
EOL

chmod +x ./scripts/fix-components-typescript.sh

# Step 7: Create a daily check script
echo -e "${YELLOW}Step 7: Creating daily TypeScript error check script...${NC}"
cat > ./scripts/typescript-daily-check.sh << EOL
#!/usr/bin/env bash

# Daily TypeScript error check script
# Runs analysis and updates progress tracking

set -e

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Daily TypeScript Error Check =====${NC}"

# Run ESLint to get current error count
echo -e "${YELLOW}Counting current TypeScript errors...${NC}"
ERROR_COUNT=\$(npx eslint --config ./config/eslint/index.js ./src --ext .ts,.tsx 2>&1 | grep -c "@typescript-eslint/" || echo 0)

# Get previous count from progress.md
PREV_COUNT=\$(grep -A 1 "Remaining Errors" ./typescript-fix/progress.md | tail -1 | awk -F'|' '{print \$3}' | xargs)
if [ -z "\$PREV_COUNT" ]; then
  PREV_COUNT=479 # Initial count
fi

# Calculate difference
FIXED_TODAY=\$((\$PREV_COUNT - \$ERROR_COUNT))
if [ \$FIXED_TODAY -lt 0 ]; then
  FIXED_TODAY=0
  echo -e "${RED}Warning: Error count increased!${NC}"
fi

# Update progress.md
echo -e "${YELLOW}Updating progress tracker...${NC}"
sed -i "/^## Progress/a | \$(date +%Y-%m-%d) | \$ERROR_COUNT | \$FIXED_TODAY | Daily check |" ./typescript-fix/progress.md

# Calculate completion percentage
COMPLETION=\$(( (479 - \$ERROR_COUNT) * 100 / 479 ))

echo -e "${GREEN}Current status:${NC}"
echo "Remaining errors: \$ERROR_COUNT"
echo "Fixed today: \$FIXED_TODAY"
echo "Completion: \$COMPLETION%"

# Update dashboard if it exists
if [ -f "./typescript-fix/dashboard.html" ]; then
  echo -e "${YELLOW}Updating dashboard...${NC}"
  sed -i "s/<div class=\"progress\" style=\"width: [0-9]*%\"><\/div>/<div class=\"progress\" style=\"width: \${COMPLETION}%\"><\/div>/g" ./typescript-fix/dashboard.html
  sed -i "s/<p id=\"total-errors\">[0-9]*<\/p>/<p id=\"total-errors\">479<\/p>/g" ./typescript-fix/dashboard.html
  sed -i "s/<p id=\"fixed-errors\">[0-9]*<\/p>/<p id=\"fixed-errors\">$((479 - ERROR_COUNT))<\/p>/g" ./typescript-fix/dashboard.html
  sed -i "s/<p id=\"remaining-errors\">[0-9]*<\/p>/<p id=\"remaining-errors\">\${ERROR_COUNT}<\/p>/g" ./typescript-fix/dashboard.html
  sed -i "s/<p id=\"completion\">[0-9]*%<\/p>/<p id=\"completion\">\${COMPLETION}%<\/p>/g" ./typescript-fix/dashboard.html
fi

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Continue fixing errors in priority files"
echo "2. Run './scripts/fix-auth-typescript.sh' or './scripts/fix-components-typescript.sh' to address high-priority modules"
echo "3. Run this script daily to track progress"

echo -e "${GREEN}Done!${NC}"
EOL

chmod +x ./scripts/typescript-daily-check.sh

# Final instructions
echo -e "${GREEN}Setup complete! To start fixing TypeScript issues:${NC}"
echo "1. Run this script again to perform the initial analysis"
echo "2. Check ./typescript-fix/typescript-errors-report.md for error details"
echo "3. Start with high-priority files listed in ./typescript-fix/priority-files.md"
echo "4. Use './scripts/fix-auth-typescript.sh' to begin fixing the Auth module (high error count)"
echo "5. Use './scripts/fix-components-typescript.sh' to fix critical components"
echo "6. Track progress with './scripts/typescript-daily-check.sh'"

echo -e "${BLUE}Remember to commit your changes frequently to track progress!${NC}"
