import type { Account } from "@/types/account";
import type { Order } from "@/types/order";
import type { Position } from "@/types/position";
import { ErrorHandler } from "@/services/errorHandling";

type WebSocketEventMap = {
  ACCOUNT_METRICS_UPDATE: Account;
  ORDER_FILLED: Order;
  ORDER_PENDING: Order;
  ORDER_CANCELLED: Order;
  POSITION_CLOSED: Position;
};

type WebSocketEventType = keyof WebSocketEventMap;
type EventHandler<T extends WebSocketEventType> = (
  data: WebSocketEventMap[T]
) => void;

const getWebSocketUrl = () => {
  const envUrl = import.meta.env.VITE_WEBSOCKET_URL;
  if (envUrl) return envUrl;
  const protocol = "ws";
  let host = window.location.hostname;
  if (host.endsWith("app.github.dev")) {
    host = host.replace(/-\d+\./, "-3001.");
    return `${protocol}://${host}`;
  }
  if (host === "localhost" || host === "127.0.0.1") {
    return `${protocol}://localhost:3001`;
  }
  return `${protocol}://${host}:3001`;
};

let socket: WebSocket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000;

const eventHandlers = new Map<
  WebSocketEventType,
  Set<EventHandler<WebSocketEventType>>
>();

class WebSocketService {
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (socket?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      const wsUrl = getWebSocketUrl();
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        reconnectAttempts = 0;
        console.log("WebSocket connected");
        resolve();
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        this.handleReconnect();
      };

      socket.onerror = (error) => {
        ErrorHandler.handleError(error, {
          description: "There was an error with the WebSocket connection",
          duration: 5000,
          retryFn: async () => {
            await this.connect();
          },
        });
        reject(error);
      };

      socket.onmessage = (event) => {
        try {
          const { type, payload } = JSON.parse(event.data);
          const handlers = eventHandlers.get(type as WebSocketEventType);
          handlers?.forEach((handler) => handler(payload));
        } catch (error) {
          ErrorHandler.handleError(error, {
            description:
              "There was an error processing the incoming WebSocket message",
            duration: 3000,
          });
        }
      };
    });
  }

  on<T extends WebSocketEventType>(event: T, handler: EventHandler<T>) {
    if (!eventHandlers.has(event)) {
      eventHandlers.set(event, new Set());
    }
    eventHandlers.get(event)?.add(handler as EventHandler<WebSocketEventType>);
  }

  off<T extends WebSocketEventType>(event: T, handler: EventHandler<T>) {
    eventHandlers
      .get(event)
      ?.delete(handler as EventHandler<WebSocketEventType>);
  }

  disconnect() {
    socket?.close();
    socket = null;
  }

  private handleReconnect() {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error("Max reconnection attempts reached");
      return;
    }

    setTimeout(
      async () => {
        reconnectAttempts++;
        try {
          await this.connect();
        } catch (error) {
          console.error("Reconnection attempt failed:", error);
        }
      },
      RECONNECT_DELAY * Math.pow(2, reconnectAttempts)
    );
  }

  send<T extends WebSocketEventType>(type: T, payload: WebSocketEventMap[T]) {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn("WebSocket is not connected. Message not sent:", {
        type,
        payload,
      });
    }
  }
}

export const websocketService = new WebSocketService();
