import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { ServerState, WebSocketMessage } from "./types";

let wss: WebSocketServer;

export function initWebSocket(server: Server, state: ServerState): void {
    wss = new WebSocketServer({ server });

    wss.on("connection", (ws: WebSocket) => {
        console.log("Client connected");
        let userId: string | undefined;

        ws.on("message", (rawMessage: Buffer) => {
            try {
                const message: WebSocketMessage = JSON.parse(rawMessage.toString());
                console.log("Received message:", message);

                // Store client connection with userId if provided
                if (message.userId) {
                    userId = message.userId;
                    state.wsClients.set(userId, ws);
                }

                // Handle the message based on type
                switch (message.type) {
                    case "ping":
                        ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
                        break;
                    default:
                        ws.send(JSON.stringify({ 
                            type: "error", 
                            payload: `Unknown message type: ${message.type}` 
                        }));
                }
            } catch (error) {
                console.error("Error processing WebSocket message:", error);
                ws.send(JSON.stringify({ 
                    type: "error", 
                    payload: "Invalid message format" 
                }));
            }
        });

        ws.on("close", () => {
            console.log("Client disconnected");
            if (userId) {
                state.wsClients.delete(userId);
            }
        });

        ws.on("error", (error: Error) => {
            console.error("WebSocket error:", error);
            if (userId) {
                state.wsClients.delete(userId);
            }
        });
    });

    console.log("WebSocket server initialized");
}

export function broadcast(data: unknown): void {
    const message = JSON.stringify(data);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

export function sendToUser(userId: string, data: unknown): boolean {
    const ws = wss.clients.get(userId);
    if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
        return true;
    }
    return false;
}
