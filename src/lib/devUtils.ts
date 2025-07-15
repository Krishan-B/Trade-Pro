/**
 * In a development environment, this utility checks for duplicate keys in a collection of items.
 * It logs a warning to the console if any duplicates are found, which helps in debugging React's "duplicate key" warnings.
 *
 * @param items - An array of items to check for duplicate keys.
 * @param keySelector - A function that selects the key from an item.
 * @param componentName - The name of the component where the check is being performed, used for logging.
 */
export function logDuplicateKeys<T>(
  items: T[],
  keySelector: (item: T) => string | number,
  componentName: string
) {
  if (process.env.NODE_ENV === 'development') {
    const seenKeys = new Set<string | number>();
    for (const item of items) {
      const key = keySelector(item);
      if (seenKeys.has(key)) {
        console.warn(
          `[Duplicate Key Warning] in ${componentName}: Key "${key}" is duplicated.`
        );
      }
      seenKeys.add(key);
    }
  }
}