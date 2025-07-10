/**
 * API Types for Trade-Pro
 * Contains type definitions for API requests, responses and related utilities
 */

import { AppError } from "./domain";

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: AppError | null;
  status?: number;
  metadata?: {
    timestamp: number;
    requestId?: string;
    [key: string]: unknown;
  };
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

/**
 * API request parameters with pagination
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Filter parameters for list endpoints
 */
export type FilterParams = Record<string, | string
    | number
    | boolean
    | string[]
    | number[]
    | null
    | undefined>;

/**
 * Common query parameters
 */
export type QueryParams = PaginationParams & FilterParams;

/**
 * Type guard for API responses
 */
export function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
  return (
    typeof obj === "object" && obj !== null && ("data" in obj || "error" in obj)
  );
}

/**
 * Type guard for paginated responses
 */
export function isPaginatedResponse<T>(
  obj: unknown
): obj is PaginatedApiResponse<T> {
  return (
    isApiResponse<T[]>(obj) &&
    "pagination" in obj &&
    typeof obj.pagination === "object"
  );
}
