import { AuthError, AuthResponse } from "@supabase/supabase-js";

export interface TestError {
  code: string;
  message: string;
  details?: string;
}

export interface PostgrestError {
  code: string;
  message: string;
  details: string;
}

export type SupabaseError = PostgrestError | AuthError;

export function isTestError(error: unknown): error is TestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as TestError).code === "string" &&
    "message" in error &&
    typeof (error as TestError).message === "string"
  );
}

export function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string" &&
    "details" in error &&
    typeof (error as { details: unknown }).details === "string"
  );
}

export function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    error instanceof Error &&
    "status" in error &&
    typeof (error as AuthError).status === "number" &&
    (error as Error).name === "AuthError"
  );
}

interface ErrorWithStack {
  message: string;
  stack?: string;
  status?: number;
}

export function formatError(error: unknown): TestError {
  if (isTestError(error)) {
    return error;
  }
  if (isPostgrestError(error)) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }
  if (isAuthError(error)) {
    const authError = error as AuthError & ErrorWithStack;
    return {
      code: String(authError.status || "AUTH_ERROR"),
      message: authError.message,
      details: authError.stack,
    };
  }
  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      message: error.message,
      details: error.stack,
    };
  }
  return {
    code: "UNKNOWN_ERROR",
    message: String(error),
  };
}

export function assertError<T>(result: {
  data: T | null;
  error: PostgrestError | null;
}): asserts result is { data: null; error: PostgrestError } {
  if (!result.error || result.data !== null) {
    throw new Error("Expected error result but got success");
  }
  if (!isPostgrestError(result.error)) {
    throw new Error("Expected PostgrestError but got different error type");
  }
}

export function assertSuccess<T>(result: {
  data: T | null;
  error: PostgrestError | null;
}): asserts result is { data: T; error: null } {
  if (result.error !== null || result.data === null) {
    throw new Error("Expected success result but got error");
  }
}

export function assertAuthSuccess(
  result: AuthResponse
): asserts result is AuthResponse & { error: null } {
  if (result.error !== null || !result.data) {
    throw new Error("Expected auth success but got error");
  }
}

export function assertAuthError(
  result: AuthResponse
): asserts result is AuthResponse & {
  data: { user: null; session: null };
  error: AuthError;
} {
  if (
    result.error === null ||
    !isAuthError(result.error) ||
    result.data?.user !== null ||
    result.data?.session !== null
  ) {
    throw new Error(
      "Expected auth error but got success or invalid error type"
    );
  }
}
