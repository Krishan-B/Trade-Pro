import { renderHook } from "@testing-library/react";
import { useOrderApi } from "../services/tradingApi";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Session, User } from "@supabase/supabase-js";
import type { AuthContextType } from "../features/auth/context/AuthContext";
import { useAuth } from "../hooks/useAuth";

// Define a minimal mock user and session
const mockUser: User = {
  id: "test-user",
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "test@example.com",
  app_metadata: {},
  user_metadata: {},
  role: "",
  updated_at: new Date().toISOString(),
};

const mockSession: Session = {
  access_token: "test-token",
  token_type: "bearer",
  expires_in: 3600,
  expires_at: Date.now() + 3600,
  refresh_token: "test-refresh",
  user: mockUser,
};

// Define the mock auth context
const mockAuthContext: AuthContextType = {
  session: mockSession,
  user: mockUser,
  profile: null,
  loading: false,
  profileLoading: false,
  signOut: vi.fn(),
  refreshSession: vi.fn().mockResolvedValue(mockSession),
  updateProfile: vi.fn().mockResolvedValue(undefined),
  refreshProfile: vi.fn().mockResolvedValue(undefined),
};

// Setup mocks
vi.mock("../hooks/useAuth", () => ({
  useAuth: () => mockAuthContext,
}));

// Setup fetch mock
const mockFetch = vi.fn().mockImplementation(() =>
  Promise.resolve(
    new Response(JSON.stringify([]), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  )
);

global.fetch = mockFetch as unknown as typeof fetch;

// Mock the ErrorHandler
vi.mock("../services/errorHandling", () => ({
  ErrorHandler: {
    show: vi.fn(),
  },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch.mockImplementation(() =>
    Promise.resolve(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )
  );
  // Provide a mock session for the useAuth hook
  mockUseAuth.mockReturnValue(mockAuthContext);
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("useOrderApi", () => {
  it("fetches orders successfully", async () => {
    const { result } = renderHook(() => useOrderApi());
    const orders = await result.current.getOrders();

    expect(orders).toEqual([]);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/orders"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );
  });

  it("handles error when fetch fails", async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: "Failed" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    const { result } = renderHook(() => useOrderApi());
    await expect(result.current.getOrders()).rejects.toThrow();
  });

  it("throws an error if not authenticated", async () => {
    // Override the mock to simulate no session
    mockUseAuth.mockReturnValue({ ...mockAuthContext, session: null });
    const { result } = renderHook(() => useOrderApi());
    await expect(result.current.getOrders()).rejects.toThrow(
      "Not authenticated"
    );
  });
});
