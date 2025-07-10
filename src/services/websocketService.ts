import type { Account } from "@/types/account";
import type {
  WebSocketEventType,
  WebSocketMessage,
  EnhancedOrder,
  Position,
} from "@shared/types/trading";
import { ErrorHandler } from "@/services/errorHandling";

interface WebSocketPayloadMap {
  ACCOUNT_METRICS_UPDATE: Account;
  ORDER_FILLED: EnhancedOrder;
  ORDER_PENDING: EnhancedOrder;
  ORDER_CANCELLED: EnhancedOrder;
  POSITION_CLOSED: Position;
}

type EventHandler<T extends WebSocketEventType> = (
  data: WebSocketPayloadMap[T]
) => void;

type GenericEventHandler = EventHandler<WebSocketEventType>;

const getWebSocketUrl = () => {
  const envUrl = import.meta.env.VITE_WEBSOCKET_URL;
  if (envUrl) return envUrl;
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
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

class WebSocketService {
  private ws: WebSocket | null = null;
  private eventHandlers = new Map<
    WebSocketEventType,
    Set<GenericEventHandler>
  >();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect() {
    if (this.ws && this.ws.readyState !== WebSocket.CLOSED) return;

    this.ws = new WebSocket(getWebSocketUrl());

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      console.log("WebSocket connected");
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(
          event.data
        ) as WebSocketMessage<WebSocketEventType>;
        this.handleMessage(message);
      } catch (error) {
        ErrorHandler.handleError(
          ErrorHandler.createError({
            code: "websocket_message_parse_error",
            message: "Failed to parse WebSocket message",
            details: { error },
          })
        );
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      ErrorHandler.handleError(
        ErrorHandler.createError({
          code: "websocket_error",
          message: "WebSocket error occurred",
          details: { error },
        })
      );
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.eventHandlers.clear();
  }

  private handleMessage<T extends WebSocketEventType>(
    message: WebSocketMessage<T>
  ) {
    const handlers = this.eventHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          (handler as EventHandler<T>)(
            message.payload as WebSocketPayloadMap[T]
          );
        } catch (error) {
          ErrorHandler.handleError(
            ErrorHandler.createError({
              code: "websocket_handler_error",
              message: "Error in WebSocket event handler",
              details: { error, eventType: message.type },
            })
          );
        }
      });
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(
        () => { this.connect(); },
        this.reconnectDelay * this.reconnectAttempts
      );
    } else {
      ErrorHandler.handleError(
        ErrorHandler.createError({
          code: "websocket_reconnect_failed",
          message: "Failed to reconnect to WebSocket server",
          details: { attempts: this.reconnectAttempts },
        })
      );
    }
  }

  on<T extends WebSocketEventType>(event: T, handler: EventHandler<T>) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    // Type assertion is safe here because we know the handler matches the event type
    this.eventHandlers.get(event)!.add(handler as GenericEventHandler);
  }

  off<T extends WebSocketEventType>(event: T, handler: EventHandler<T>) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler as GenericEventHandler);
      if (handlers.size === 0) {
        this.eventHandlers.delete(event);
      }
    }
  }
}

export const websocketService = new WebSocketService();
