/**
 * Error Types for Trade-Pro
 * Contains type definitions for error handling and error classification
 */

import { AppError } from "./domain";

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  INFO = "INFO", // Informational message, not a true error
  WARNING = "WARNING", // Warning that doesn't prevent functionality
  ERROR = "ERROR", // Standard error, affects functionality but not critical
  CRITICAL = "CRITICAL", // Critical error, affects core functionality
  FATAL = "FATAL", // Fatal error, application cannot function
}

/**
 * Error categories for better classification
 */
export enum ErrorCategory {
  NETWORK = "NETWORK", // Network/API related errors
  VALIDATION = "VALIDATION", // Input validation errors
  AUTHENTICATION = "AUTHENTICATION", // Auth related errors
  AUTHORIZATION = "AUTHORIZATION", // Permission related errors
  DATA = "DATA", // Data processing/integrity errors
  BUSINESS_LOGIC = "BUSINESS_LOGIC", // Business rule violations
  EXTERNAL_SERVICE = "EXTERNAL_SERVICE", // External service errors
  INTERNAL = "INTERNAL", // Internal application errors
  UNKNOWN = "UNKNOWN", // Unclassified errors
}

/**
 * Enhanced error object with additional metadata
 */
export interface EnhancedError extends AppError {
  severity?: ErrorSeverity;
  category?: ErrorCategory;
  timestamp?: number;
  requestId?: string;
  path?: string;
  originalError?: unknown;
  actionRequired?: boolean;
  suggestedAction?: string;
}

/**
 * Error with field validation details
 */
export interface ValidationError extends EnhancedError {
  category: ErrorCategory.VALIDATION;
  fieldErrors?: Record<string, string>;
}

/**
 * Type guard for ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "category" in error &&
    (error as ValidationError).category === ErrorCategory.VALIDATION &&
    "fieldErrors" in error
  );
}

/**
 * Type guard for EnhancedError
 */
export function isEnhancedError(error: unknown): error is EnhancedError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    "retryable" in error
  );
}

/**
 * Create proper error object from unknown error
 */
export function toAppError(error: unknown): AppError {
  if (isEnhancedError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      message: error.message,
      retryable: false,
      details: error,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unknown error occurred",
    retryable: false,
    details: error,
  };
}
