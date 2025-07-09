import { renderHook, act } from "@testing-library/react";
import { useOrderApi } from "../services/tradingApi";
import { vi, Mock, describe, it, expect, beforeEach, afterEach } from "vitest";
// Update the import path below if your useAuth file is named differently or in a different location
import { useAuth } from "../hooks/useAuth";

// Mock the ErrorHandler
vi.mock("../services/errorHandling", () => ({
  ErrorHandler: {
    show: vi.fn(),
  },
}));

// Mock the useAuth hook
vi.mock("../hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

// Helper to create a minimal Response-like mock
function createFetchResponse(data: unknown, ok = true): Response {
  return {
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(data),
    // ...other Response properties as needed
  } as unknown as Response;
}

beforeEach(() => {
  global.fetch = vi.fn(() => Promise.resolve(createFetchResponse([])));
  // Provide a mock session for the useAuth hook
  (useAuth as Mock).mockReturnValue({
    session: { access_token: "test-token" },
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("useOrderApi", () => {
  it("fetches orders successfully", async () => {
    const { result } = renderHook(() => useOrderApi());
    let orders;
    await act(async () => {
      orders = await result.current.getOrders();
    });
    expect(orders).toEqual([]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/orders"),
      expect.any(Object)
    );
  });

  it("handles fetch errors", async () => {
    (global.fetch as Mock).mockImplementationOnce(() =>
      Promise.reject(new Error("Network error"))
    );
    const { result } = renderHook(() => useOrderApi());
    await expect(result.current.getOrders()).rejects.toThrow("Network error");
  });

  it("throws an error if not authenticated", async () => {
    // Override the mock to simulate no session
    (useAuth as Mock).mockReturnValue({ session: null });
    const { result } = renderHook(() => useOrderApi());
    await expect(result.current.getOrders()).rejects.toThrow(
      "Not authenticated"
    );
  });
});
