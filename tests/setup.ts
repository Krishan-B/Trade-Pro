import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock Service Worker setup
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

const handlers = [
  // Mock Supabase Auth
  http.post("https://hntsrkacolpseqnyidis.supabase.co/auth/v1/token", () => {
    return HttpResponse.json({
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      user: {
        id: "a0b1c2d3-e4f5-g6h7-i8j9-k0l1m2n3o4p5", // Mock UUID
        aud: "authenticated",
        role: "authenticated",
        email: "test@example.com",
        app_metadata: { provider: "email" },
        user_metadata: { name: "Test User" },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  }),
  http.post("https://hntsrkacolpseqnyidis.supabase.co/auth/v1/signup", () => {
    return HttpResponse.json({
      id: "a0b1c2d3-e4f5-g6h7-i8j9-k0l1m2n3o4p5",
      aud: "authenticated",
      role: "authenticated",
      email: "test@example.com",
      app_metadata: { provider: "email" },
      user_metadata: { name: "Test User" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }),
  http.get("https://hntsrkacolpseqnyidis.supabase.co/auth/v1/user", () => {
    return HttpResponse.json({
      id: "a0b1c2d3-e4f5-g6h7-i8j9-k0l1m2n3o4p5",
      aud: "authenticated",
      role: "authenticated",
      email: "test@example.com",
      app_metadata: { provider: "email" },
      user_metadata: { name: "Test User" },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }),

  // Mock Supabase Storage
  http.post(
    "https://hntsrkacolpseqnyidis.supabase.co/storage/v1/object/*",
    async ({ request }) => {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      return HttpResponse.json({ Key: `/${file.name}` });
    }
  ),
  http.get(
    "https://hntsrkacolpseqnyidis.supabase.co/storage/v1/object/public/*",
    () => {
      return new HttpResponse(new Blob(["file content"]), {
        status: 200,
        headers: { "Content-Type": "application/octet-stream" },
      });
    }
  ),
  http.get("https://hntsrkacolpseqnyidis.supabase.co/storage/v1/list/*", () => {
    return HttpResponse.json([
      {
        name: "test.txt",
        id: "some-uuid-1",
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
        metadata: { size: 12 },
      },
      {
        name: "another.txt",
        id: "some-uuid-2",
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
        metadata: { size: 15 },
      },
    ]);
  }),

  // Mock Supabase Edge Functions
  http.post("https://hntsrkacolpseqnyidis.supabase.co/functions/v1/*", () => {
    return HttpResponse.json({ success: true, data: { processed: true } });
  }),

  // Fallback for any other API call
  http.get("http://localhost:4000/api/*", () => {
    return HttpResponse.json({ message: "Mocked success" });
  }),
];

const server = setupServer(...handlers);

// Establish API mocking before all tests.
beforeAll(() => { server.listen(); });

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

// Clean up after the tests are finished.
afterAll(() => {
  server.close();
  vi.restoreAllMocks();
});

// Mock WebSocket for Realtime
class MockWebSocket implements WebSocket {
  // Add static properties for compatibility with WebSocket interface
  readonly CONNECTING = 0 as const;
  readonly OPEN = 1 as const;
  readonly CLOSING = 2 as const;
  readonly CLOSED = 3 as const;

  static server: MockWebSocket | null = null;

  binaryType: BinaryType = "blob";
  bufferedAmount = 0;
  extensions = "";
  protocol = "";
  url = "";

  constructor(url: string | URL, protocols?: string | string[]) {
    this.url = url.toString();
    MockWebSocket.server = this;
    // Simulate connection opening
    setTimeout(() => {
      if (this.onopen) {
        this.onopen.call(this, {} as Event);
      }
    }, 10);
  }

  close = vi.fn(() => {
    this.readyState = 3; // CLOSED
    if (this.onclose) this.onclose.call(this, {} as CloseEvent);
  });
  send = vi.fn();
  addEventListener: WebSocket["addEventListener"] = vi.fn();
  removeEventListener: WebSocket["removeEventListener"] = vi.fn();
  dispatchEvent: WebSocket["dispatchEvent"] = vi.fn();
  readyState = 1; // OPEN

  onopen: ((this: WebSocket, ev: Event) => unknown) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => unknown) | null = null;
  onclose: ((this: WebSocket, ev: CloseEvent) => unknown) | null = null;
  onerror: ((this: WebSocket, ev: Event) => unknown) | null = null;

  // Method to simulate a message from the server
  simulateServerMessage(data: unknown) {
    if (this.onmessage) {
      this.onmessage.call(this, { data: JSON.stringify(data) } as MessageEvent);
    }
  }
}

(global as unknown as { WebSocket: typeof MockWebSocket }).WebSocket =
  MockWebSocket;
