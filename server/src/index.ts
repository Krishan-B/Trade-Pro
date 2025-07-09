import dotenv from "dotenv";
import express, { Express } from "express";
import cors from "cors";
import { createServer } from "http";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@shared/types";

// Routes
import ordersRouter from "./routes/orders";
import positionsRouter from "./routes/positions";
import accountRouter from "./routes/account";
import authRouter from "./routes/auth";
import kycRouter from "./routes/kyc";
import healthRouter from "./routes/health";
import { initWebSocket } from "./websocket";
import { ServerState } from "./types";

// Initialize environment variables
dotenv.config();

// Log environment variables for debugging
console.log("Starting server with configuration:");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY (anon):", process.env.SUPABASE_KEY?.substring(0, 10) + "...");
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10) + "...");

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Initialize Express app and state
const app: Express = express();
const state: ServerState = {
  supabase,
  wsClients: new Map(),
  store: new Map()
};

// Attach state to app.locals
app.locals.state = state;

// Middleware
app.use(cors());
app.use(express.json());

// Mount routers
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/positions", positionsRouter);
app.use("/api/kyc", kycRouter);

// Start server
const PORT = process.env.PORT || 3001;
const server = createServer(app);

// Initialize WebSocket
initWebSocket(server, state);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
