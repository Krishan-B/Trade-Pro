// Recursively convert all Date objects in an object to ISO strings
export function normalizeDates<T>(obj: T): T {
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  if (Array.isArray(obj)) {
    return obj.map(normalizeDates);
  }
  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = normalizeDates(value);
    }
    return result;
  }
  return obj;
}
// Utility to omit properties with undefined values from an object
export function omitUndefined<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  )<T>;
}
