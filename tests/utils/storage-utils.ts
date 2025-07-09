import type { StorageError } from "@supabase/storage-js";

export function assertStorageSuccess<T>(result: {
  data: T | null;
  error: StorageError | null;
}): asserts result is { data: T; error: null } {
  expect(result.error).toBeNull();
  expect(result.data).not.toBeNull();
}
