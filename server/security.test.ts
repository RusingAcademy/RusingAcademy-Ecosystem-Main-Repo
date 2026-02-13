import { describe, it, expect } from "vitest";
import {
  apiRateLimiter,
  authRateLimiter,
  paymentRateLimiter,
  corsMiddleware,
  helmetMiddleware,
  sanitizeRequest,
  registerSecurityMiddleware,
} from "./middleware/security";

describe("Security Middleware — Sprint 2", () => {
  it("should export all security middleware functions", () => {
    expect(apiRateLimiter).toBeDefined();
    expect(typeof apiRateLimiter).toBe("function");
    expect(authRateLimiter).toBeDefined();
    expect(typeof authRateLimiter).toBe("function");
    expect(paymentRateLimiter).toBeDefined();
    expect(typeof paymentRateLimiter).toBe("function");
    expect(corsMiddleware).toBeDefined();
    expect(typeof corsMiddleware).toBe("function");
    expect(helmetMiddleware).toBeDefined();
    expect(typeof helmetMiddleware).toBe("function");
    expect(sanitizeRequest).toBeDefined();
    expect(typeof sanitizeRequest).toBe("function");
    expect(registerSecurityMiddleware).toBeDefined();
    expect(typeof registerSecurityMiddleware).toBe("function");
  });

  it("sanitizeRequest should strip null bytes from query params", () => {
    const req = {
      query: { search: "hello\0world", clean: "normal", nested: "test\0\0value" },
    } as any;
    const res = {} as any;
    const next = () => {};
    sanitizeRequest(req, res, next);
    expect(req.query.search).toBe("helloworld");
    expect(req.query.clean).toBe("normal");
    expect(req.query.nested).toBe("testvalue");
  });

  it("sanitizeRequest should handle empty query params", () => {
    const req = { query: {} } as any;
    const res = {} as any;
    let nextCalled = false;
    const next = () => { nextCalled = true; };
    sanitizeRequest(req, res, next);
    expect(nextCalled).toBe(true);
  });

  it("sanitizeRequest should handle undefined query", () => {
    const req = { query: undefined } as any;
    const res = {} as any;
    let nextCalled = false;
    const next = () => { nextCalled = true; };
    sanitizeRequest(req, res, next);
    expect(nextCalled).toBe(true);
  });

  it("rate limiters should be distinct middleware instances", () => {
    expect(typeof apiRateLimiter).toBe("function");
    expect(typeof authRateLimiter).toBe("function");
    expect(typeof paymentRateLimiter).toBe("function");
    expect(apiRateLimiter).not.toBe(authRateLimiter);
    expect(authRateLimiter).not.toBe(paymentRateLimiter);
  });

  it("registerSecurityMiddleware should register multiple middleware on app", () => {
    const useCalls: any[] = [];
    const setCalls: any[] = [];
    const mockApp = {
      use: (...args: any[]) => useCalls.push(args),
      set: (...args: any[]) => setCalls.push(args),
    } as any;
    registerSecurityMiddleware(mockApp);
    expect(useCalls.length).toBeGreaterThan(3);
    expect(setCalls.some((c: any[]) => c[0] === "trust proxy")).toBe(true);
  });
});
