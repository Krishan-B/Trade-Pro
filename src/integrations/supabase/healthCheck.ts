import { supabase } from "./client";

interface ServiceHealth {
  isHealthy: boolean;
  responseTime: number;
  error?: string;
}

export interface HealthCheckResult {
  isHealthy: boolean;
  responseTime: number;
  timestamp: string;
  services: {
    database: ServiceHealth;
    auth: ServiceHealth;
    storage: ServiceHealth;
  };
}

export interface SupabaseError extends Error {
  status?: number;
}

function isSupabaseError(error: Error): error is SupabaseError {
  return "status" in error;
}

async function checkDatabaseHealth(timeout = 5000): Promise<ServiceHealth> {
  const startTime = Date.now();

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => { reject(new Error("Database health check timed out")); },
        timeout
      );
    });

    const checkPromise = supabase
      .from("health_checks")
      .select("count")
      .single();

    const { error } = await Promise.race([checkPromise, timeoutPromise]);

    if (error) {
      const e = error;
      if (isSupabaseError(e)) {
        throw new Error(`Database error (status ${e.status}): ${e.message}`);
      }
      throw e;
    }

    return {
      isHealthy: true,
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      isHealthy: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}

async function checkAuthHealth(timeout = 5000): Promise<ServiceHealth> {
  const startTime = Date.now();
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => { reject(new Error("Auth health check timed out")); },
        timeout
      );
    });

    const checkPromise = supabase.auth.getSession();

    const { error } = await Promise.race([checkPromise, timeoutPromise]);

    return {
      isHealthy: !error,
      responseTime: Date.now() - startTime,
      error: error?.message,
    };
  } catch (err) {
    return {
      isHealthy: false,
      responseTime: Date.now() - startTime,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

async function checkStorageHealth(timeout = 5000): Promise<ServiceHealth> {
  const startTime = Date.now();
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => { reject(new Error("Storage health check timed out")); },
        timeout
      );
    });

    const checkPromise = supabase.storage.listBuckets();

    const { error } = await Promise.race([checkPromise, timeoutPromise]);

    return {
      isHealthy: !error,
      responseTime: Date.now() - startTime,
      error: error?.message,
    };
  } catch (err) {
    return {
      isHealthy: false,
      responseTime: Date.now() - startTime,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Comprehensive health check for all Supabase services
 */
export async function checkSupabaseHealth(
  timeout = 5000
): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // Run all health checks in parallel
    const [database, auth, storage] = await Promise.all([
      checkDatabaseHealth(timeout),
      checkAuthHealth(timeout),
      checkStorageHealth(timeout),
    ]);

    const responseTime = Date.now() - startTime;

    return {
      isHealthy: database.isHealthy && auth.isHealthy && storage.isHealthy,
      responseTime,
      timestamp: new Date().toISOString(),
      services: {
        database,
        auth,
        storage,
      },
    };
  } catch (err) {
    const responseTime = Date.now() - startTime;

    return {
      isHealthy: false,
      responseTime,
      timestamp: new Date().toISOString(),
      services: {
        database: {
          isHealthy: false,
          responseTime,
          error: "Failed to complete health checks",
        },
        auth: {
          isHealthy: false,
          responseTime,
          error: "Failed to complete health checks",
        },
        storage: {
          isHealthy: false,
          responseTime,
          error: "Failed to complete health checks",
        },
      },
    };
  }
}
