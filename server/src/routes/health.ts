import express from "express";
import { Router } from "express";
import { checkSupabaseHealth } from "../integrations/supabase/healthCheck";
import { healthMonitor } from "../integrations/supabase/healthMonitor";
import { HealthCheckRequest, HealthCheckResponse } from "./types";
import { NextFunction, Response } from "express";

const router: Router = express.Router();

router.get("/", async (req: HealthCheckRequest, res: Response<HealthCheckResponse>, next: NextFunction) => {
    try {
        const currentHealth = await checkSupabaseHealth();
        const monitorHistory = healthMonitor.getLastHealth();

        const response: HealthCheckResponse = {
            status: "success",
            timestamp: new Date().toISOString(),
            services: {
                supabase: currentHealth,
                monitoring: {
                    isActive: true,
                    lastCheck: monitorHistory,
                },
            },
        };

        res.json(response);
    } catch (error) {
        const errorResponse: HealthCheckResponse = {
            status: "error",
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };

        res.status(500).json(errorResponse);
        next(error);
    }
});

export default router;
