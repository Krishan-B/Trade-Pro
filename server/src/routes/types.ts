import { Request, Response, NextFunction } from "express";
import { ServerState } from "../types";

export interface TypedRequest<T = unknown> extends Request {
  body: T;
  state: ServerState;
}

export interface HealthCheckResponse {
  status: "success" | "error";
  timestamp: string;
  services?: {
    supabase: boolean;
    monitoring: {
      isActive: boolean;
      lastCheck: {
        timestamp: string;
        status: boolean;
      } | null;
    };
  };
  error?: string;
}

export interface HealthCheckRequest extends TypedRequest {
  query: {
    detail?: string;
  };
}

// Auth related types
export interface RegisterRequest extends TypedRequest {
  body: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    experience_level: string;
    preferences?: Record<string, unknown>;
  };
}

export interface LoginRequest extends TypedRequest {
  body: {
    email: string;
    password: string;
  };
}

export interface AuthResponse {
  message?: string;
  error?: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    experience_level: string;
    preferences?: Record<string, unknown>;
  };
  token?: string;
}

// Add other route-specific types as needed
