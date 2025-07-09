export function isTestError(error) {
    return (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error);
}
export function isPostgrestError(error) {
    return (typeof error === "object" &&
        error !== null &&
        "code" in error &&
        "message" in error &&
        "details" in error);
}
export function isAuthError(error) {
    return (typeof error === "object" &&
        error !== null &&
        error instanceof Error &&
        "message" in error &&
        "status" in error &&
        error.name === "AuthError");
}
export function formatError(error) {
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
        return {
            code: String(error.status),
            message: error.message,
            details: error.stack,
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
export function assertError(result) {
    expect(result.error).not.toBeNull();
    expect(isPostgrestError(result.error)).toBe(true);
}
export function assertSuccess(result) {
    expect(result.error).toBeNull();
    expect(result.data).not.toBeNull();
}
export function assertAuthSuccess(result) {
    expect(result.error).toBeNull();
    expect(result.data).toBeDefined();
}
export function assertAuthError(result) {
    expect(result.error).not.toBeNull();
    expect(isAuthError(result.error)).toBe(true);
}
