import type { Database, Json } from "../../../src/integrations/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";

export interface ServerConfig {
  port: number;
  env: "development" | "production" | "test";
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey: string;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
}

export interface ServerState {
  supabase: SupabaseClient<Database>;
  wsClients: Map<string, WebSocket>;
  store: Map<string, unknown>;
  config: ServerConfig;
}

export interface WebSocketMessage {
  type: string;
  payload: Json;
  userId?: string;
  timestamp?: string;
  messageId?: string;
}

export type WebSocketMessageType =
  | "connection"
  | "disconnection"
  | "error"
  | "market_data"
  | "order_update"
  | "position_update"
  | "account_update"
  | "kyc_update"
  | "ping"
  | "pong";

export interface WebSocketError {
  code: number;
  message: string;
  details?: unknown;
}

export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  details?: {
    database?: boolean;
    supabase?: boolean;
    websocket?: boolean;
    redis?: boolean;
    cache?: boolean;
  };
  version?: string;
  uptime?: number;
  environment?: string;
}

export interface RouteHandlerContext {
  state: ServerState;
  userId?: string;
  requestId?: string;
  permissions?: string[];
  sessionData?: {
    created: string;
    lastActive: string;
    ip?: string;
    userAgent?: string;
  };
}

export interface AuthenticatedRequest extends Request {
  userId: string;
  sessionData?: {
    created: string;
    lastActive: string;
    ip?: string;
    userAgent?: string;
  };
  permissions?: string[];
}

export interface ErrorResponse {
  status: "error";
  code: number;
  message: string;
  details?: unknown;
  requestId?: string;
  timestamp: string;
}

export interface SuccessResponse<T> {
  status: "success";
  data: T;
  timestamp: string;
  requestId?: string;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

export interface CacheConfig {
  ttl: number;
  prefix?: string;
  invalidateOnUpdate?: boolean;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  statusCode?: number;
  keyGenerator?: (req: Request) => string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  details?: unknown;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
    validationErrors?: ValidationError[];
  };
}
