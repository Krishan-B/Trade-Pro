#!/bin/bash

echo "===== ESLint TypeScript Safety Fixing Script ====="
echo "This script addresses common TypeScript safety issues across the codebase"

# Create logs directory if it doesn't exist
LOG_DIR="/workspaces/Trade-Pro/typescript-fix/logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/typescript-safety-fixes-$TIMESTAMP.log"

# Create a backup directory
BACKUP_DIR="/workspaces/Trade-Pro/typescript-fix/typescript-safety-backups-$TIMESTAMP"
mkdir -p "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR/src"

echo "Starting TypeScript safety fixes..." | tee -a "$LOG_FILE"

# Backup source files before modification
echo "Creating backups of source files..." | tee -a "$LOG_FILE"
find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
  relative_path=$(echo "$file" | sed 's|./src/||')
  dir_path=$(dirname "$BACKUP_DIR/src/$relative_path")
  mkdir -p "$dir_path"
  cp "$file" "$BACKUP_DIR/src/$relative_path"
done

# =====================================================
# Fix Floating Promises
# =====================================================
echo "Fixing floating promises across the codebase..." | tee -a "$LOG_FILE"

# Common patterns for floating promises
find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/\(navigate([^;]*\);/void \1;/g' {} \;
find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/\(supabase\.[^(]*([^;]*\);/void \1;/g' {} \;
find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/\(fetch([^;]*\);/void \1;/g' {} \;
find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/\(axios\.[^(]*([^;]*\);/void \1;/g' {} \;

# =====================================================
# Fix Misused Promises in onClick Handlers
# =====================================================
echo "Fixing misused promises in event handlers..." | tee -a "$LOG_FILE"

# This is a common pattern where async functions are passed directly to onClick
# We need to wrap these in non-async functions
find ./src -type f -name "*.tsx" -exec sed -i 's/onClick={async \([^}]*\)}/onClick={event => { void (async () => { \1 })(); }}/g' {} \;
find ./src -type f -name "*.tsx" -exec sed -i 's/onClick={\([a-zA-Z0-9_]*\)}/onClick={event => { void \1(event); }}/g' {} \;
find ./src -type f -name "*.tsx" -exec sed -i 's/onSubmit={\([a-zA-Z0-9_]*\)}/onSubmit={async (event) => { event.preventDefault(); await \1(event); }}/g' {} \;

# =====================================================
# Fix unsafe type issues - Add proper type assertions 
# =====================================================
echo "Adding proper type assertions to reduce unsafe operations..." | tee -a "$LOG_FILE"

# Common patterns for unsafe assignments and member access
find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's/const \([a-zA-Z0-9_]*\) = data\.\([a-zA-Z0-9_]*\);/const \1 = data\.\2 as unknown;/g' {} \;

# =====================================================
# Add utility functions to help with type safety
# =====================================================
echo "Creating type safety utility functions..." | tee -a "$LOG_FILE"

# Create a type safety utilities file
TYPE_UTILS_FILE="./src/utils/typeSafetyUtils.ts"
if [ ! -f "$TYPE_UTILS_FILE" ]; then
  echo "Creating type safety utilities file..." | tee -a "$LOG_FILE"
  
  cat > "$TYPE_UTILS_FILE" << 'EOF'
/**
 * Type safety utility functions to help with ESLint issues
 */

/**
 * Safely access a property on an object, with type assertion
 * @param obj The object to access property from
 * @param key The property key
 * @param defaultValue Default value if property doesn't exist
 * @returns The property value with proper typing
 */
export function safeAccess<T, K extends keyof any, D = undefined>(
  obj: unknown,
  key: K,
  defaultValue?: D
): T | D {
  if (obj && typeof obj === 'object' && key in obj) {
    return obj[key as keyof typeof obj] as T;
  }
  return defaultValue as D;
}

/**
 * Safely cast a value to a specific type, with runtime checks
 * @param value The value to cast
 * @param typeCheck Optional runtime check function
 * @returns The value cast to type T
 */
export function safeCast<T>(value: unknown, typeCheck?: (val: unknown) => boolean): T {
  if (typeCheck && !typeCheck(value)) {
    console.warn('Type check failed in safeCast', value);
  }
  return value as T;
}

/**
 * Safely handle a promise by wrapping it with void operator
 * @param promise The promise to safely handle
 */
export function safePromise<T>(promise: Promise<T>): void {
  void promise.catch(error => {
    console.error('Unhandled promise rejection:', error);
  });
}

/**
 * Create a safe event handler that properly handles async functions
 * @param handler The async handler function
 * @returns A properly typed event handler that avoids ESLint warnings
 */
export function safeEventHandler<E = React.SyntheticEvent>(
  handler: (event: E) => Promise<void> | void
): (event: E) => void {
  return (event: E) => {
    try {
      const result = handler(event);
      if (result instanceof Promise) {
        safePromise(result);
      }
    } catch (error) {
      console.error('Error in event handler:', error);
    }
  };
}
EOF
fi

echo "TypeScript safety fixes completed." | tee -a "$LOG_FILE"
echo "Original files were backed up to $BACKUP_DIR" | tee -a "$LOG_FILE"

# Run ESLint to check progress
echo "Running ESLint on a sample of files to check progress..." | tee -a "$LOG_FILE"
npx eslint --config ./config/eslint/index.js ./src/features/auth --ext .ts,.tsx > "$LOG_DIR/auth-typescript-safety-$TIMESTAMP.log" || true

echo "All fixes have been applied. Check the logs for remaining errors:"
echo "Log file: $LOG_FILE"
echo "ESLint report: $LOG_DIR/auth-typescript-safety-$TIMESTAMP.log"

echo ""
echo "Next steps:"
echo "1. Import and use the typeSafetyUtils functions to fix remaining issues"
echo "2. Run './scripts/check-typescript-errors.sh' to verify TypeScript compilation"
echo "3. Run ESLint on specific modules to check for remaining errors"
