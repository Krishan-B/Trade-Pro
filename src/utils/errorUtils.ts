/**
 * Error utility functions for Trade-Pro
 * Contains type guards and error handling utilities
 */

// Define core types inline until proper imports are established
export interface AppError {
  code: string;
  message: string;
  retryable: boolean;
  details?: unknown;
}

export interface Position {
  id: string;
  userId: string;
  accountId: string;
  symbol: string;
  assetClass?: string;
  side: string;
  quantity: number;
  entryPrice: number;
  currentPrice?: number;
  status: string;
  openedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: string;
  orderType: string;
  quantity: number;
  status: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  assetClass: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Account {
  id: string;
  userId: string;
  accountType: string;
  balance: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  type: string;
  amount: number;
}

/**
 * Type guard for AppError
 */
export function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    "retryable" in error
  );
}

/**
 * Type guard for Position
 */
export function isPosition(obj: unknown): obj is Position {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "symbol" in obj &&
    "side" in obj &&
    "quantity" in obj &&
    "entryPrice" in obj
  );
}

/**
 * Type guard for Order
 */
export function isOrder(obj: unknown): obj is Order {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "symbol" in obj &&
    "side" in obj &&
    "orderType" in obj &&
    "quantity" in obj
  );
}

/**
 * Type guard for Asset
 */
export function isAsset(obj: unknown): obj is Asset {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "symbol" in obj &&
    "name" in obj &&
    "assetClass" in obj
  );
}

/**
 * Type guard for User
 */
export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "email" in obj &&
    "role" in obj
  );
}

/**
 * Type guard for Account
 */
export function isAccount(obj: unknown): obj is Account {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "userId" in obj &&
    "accountType" in obj &&
    "balance" in obj
  );
}

/**
 * Type guard for Transaction
 */
export function isTransaction(obj: unknown): obj is Transaction {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "accountId" in obj &&
    "userId" in obj &&
    "type" in obj &&
    "amount" in obj
  );
}

/**
 * Type guard for array of a specific type
 */
export function isArrayOf<T>(
  arr: unknown,
  typeGuard: (item: unknown) => item is T
): arr is T[] {
  return (
    Array.isArray(arr) &&
    (arr.length === 0 || arr.every((item) => typeGuard(item)))
  );
}

/**
 * Convert unknown error to AppError
 */
export function toAppError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  const errorObj = error;
  if (
    typeof errorObj === "object" &&
    errorObj !== null &&
    "message" in errorObj
  ) {
    return {
      code: "UNKNOWN_ERROR",
      message: String(errorObj.message),
      retryable: false,
      details: errorObj,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: typeof error === "string" ? error : "An unknown error occurred",
    retryable: false,
    details: error,
  };
}

/**
 * Safe property access with type checking
 * Use this when TypeScript complains about no-unsafe-member-access
 */
export function safeGet<T, K extends keyof T>(
  obj: T | null | undefined,
  key: K
): T[K] | undefined {
  return obj ? obj[key] : undefined;
}

/**
 * Safe function call with type checking
 * Use this when TypeScript complains about no-unsafe-call
 */
export function safeCall<T, R>(
  fn: ((arg: T) => R) | undefined | null,
  arg: T
): R | undefined {
  return fn ? fn(arg) : undefined;
}

/**
 * Handle promises safely to avoid floating promises
 * Use this when you need to ignore the promise result but still handle errors
 */
export function safePromise<T>(promise: Promise<T>): void {
  void promise.catch((error) => {
    console.error("Unhandled promise error:", toAppError(error).message);
  });
}

/**
 * Parse JSON safely with type checking
 */
export function safeParseJSON<T>(
  text: string,
  typeGuard: (data: unknown) => data is T
): T | null {
  try {
    const data = JSON.parse(text);
    return typeGuard(data) ? data : null;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}
