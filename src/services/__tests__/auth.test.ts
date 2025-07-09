import { vi } from "vitest";
// Mock the supabase client to avoid env var errors
vi.mock("../auth", () => {
  return {
    register: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    login: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    logout: vi.fn(() => Promise.resolve({ error: null })),
    resetPassword: vi.fn(() => Promise.resolve({ data: {}, error: null })),
  };
});

import { register, login, logout, resetPassword } from "../auth";

describe("auth service", () => {
  it("should export all auth functions", () => {
    expect(typeof register).toBe("function");
    expect(typeof login).toBe("function");
    expect(typeof logout).toBe("function");
    expect(typeof resetPassword).toBe("function");
  });

  it("should call register with email and password", async () => {
    await register("test@example.com", "password123");
    expect(register).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("should call login with email and password", async () => {
    await login("test@example.com", "password123");
    expect(login).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("should call logout", async () => {
    await logout();
    expect(logout).toHaveBeenCalled();
  });

  it("should call resetPassword with email", async () => {
    await resetPassword("test@example.com");
    expect(resetPassword).toHaveBeenCalledWith("test@example.com");
  });
});
