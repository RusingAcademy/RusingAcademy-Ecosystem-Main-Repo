/**
 * Sentry Integration — Unit Tests (PR 0.3)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const sentryMocks = vi.hoisted(() => {
  return {
    init: vi.fn(),
    captureException: vi.fn(),
    captureMessage: vi.fn(),
    setUser: vi.fn(),
    close: vi.fn().mockResolvedValue(true),
    withScope: vi.fn((cb: (scope: any) => void) => {
      cb({ setExtra: vi.fn() });
    }),
    Handlers: {
      errorHandler: vi.fn(() => vi.fn()),
    },
    setupExpressErrorHandler: vi.fn(),
  };
});

vi.mock("@sentry/node", () => sentryMocks);

vi.mock("../logger", () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}));

// ─── Tests ─────────────────────────────────────────────────────────────

describe("Sentry Server Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe("initSentry", () => {
    it("should not initialize when SENTRY_DSN is empty", async () => {
      process.env.SENTRY_DSN = "";
      const { initSentry } = await import("./lib/sentry");
      initSentry();
      expect(sentryMocks.init).not.toHaveBeenCalled();
    });

    it("should initialize when SENTRY_DSN is set", async () => {
      process.env.SENTRY_DSN = "https://test@sentry.io/123";
      const { initSentry } = await import("./lib/sentry");
      initSentry();
      expect(sentryMocks.init).toHaveBeenCalledWith(
        expect.objectContaining({
          dsn: "https://test@sentry.io/123",
        })
      );
      delete process.env.SENTRY_DSN;
    });

    it("should only initialize once (idempotent)", async () => {
      process.env.SENTRY_DSN = "https://test@sentry.io/123";
      const { initSentry } = await import("./lib/sentry");
      initSentry();
      initSentry();
      // First call inits, second is no-op
      expect(sentryMocks.init).toHaveBeenCalledTimes(1);
      delete process.env.SENTRY_DSN;
    });
  });

  describe("captureException", () => {
    it("should be a no-op when DSN is empty", async () => {
      process.env.SENTRY_DSN = "";
      const { captureException } = await import("./lib/sentry");
      captureException(new Error("test"));
      expect(sentryMocks.withScope).not.toHaveBeenCalled();
    });

    it("should capture with context when DSN is set", async () => {
      process.env.SENTRY_DSN = "https://test@sentry.io/123";
      const { captureException } = await import("./lib/sentry");
      captureException(new Error("test"), { userId: 42 });
      expect(sentryMocks.withScope).toHaveBeenCalled();
      delete process.env.SENTRY_DSN;
    });
  });

  describe("captureMessage", () => {
    it("should be a no-op when DSN is empty", async () => {
      process.env.SENTRY_DSN = "";
      const { captureMessage } = await import("./lib/sentry");
      captureMessage("test message");
      expect(sentryMocks.captureMessage).not.toHaveBeenCalled();
    });

    it("should capture message when DSN is set", async () => {
      process.env.SENTRY_DSN = "https://test@sentry.io/123";
      const { captureMessage } = await import("./lib/sentry");
      captureMessage("test message", "warning");
      expect(sentryMocks.captureMessage).toHaveBeenCalledWith("test message", "warning");
      delete process.env.SENTRY_DSN;
    });
  });

  describe("setUser / clearUser", () => {
    it("should be a no-op when DSN is empty", async () => {
      process.env.SENTRY_DSN = "";
      const { setUser, clearUser } = await import("./lib/sentry");
      setUser({ id: 1, email: "test@test.com", role: "admin" });
      clearUser();
      expect(sentryMocks.setUser).not.toHaveBeenCalled();
    });

    it("should set and clear user when DSN is set", async () => {
      process.env.SENTRY_DSN = "https://test@sentry.io/123";
      const { setUser, clearUser } = await import("./lib/sentry");
      setUser({ id: 1, email: "test@test.com", role: "admin" });
      expect(sentryMocks.setUser).toHaveBeenCalledWith({
        id: "1",
        email: "test@test.com",
        segment: "admin",
      });
      clearUser();
      expect(sentryMocks.setUser).toHaveBeenCalledWith(null);
      delete process.env.SENTRY_DSN;
    });
  });

  describe("flushSentry", () => {
    it("should be a no-op when DSN is empty", async () => {
      process.env.SENTRY_DSN = "";
      const { flushSentry } = await import("./lib/sentry");
      await flushSentry();
      expect(sentryMocks.close).not.toHaveBeenCalled();
    });

    it("should flush when DSN is set", async () => {
      process.env.SENTRY_DSN = "https://test@sentry.io/123";
      const { flushSentry } = await import("./lib/sentry");
      await flushSentry(1000);
      expect(sentryMocks.close).toHaveBeenCalledWith(1000);
      delete process.env.SENTRY_DSN;
    });
  });
});

describe("Sentry Safety Guarantees", () => {
  it("should never throw even if Sentry SDK throws", async () => {
    process.env.SENTRY_DSN = "https://test@sentry.io/123";
    sentryMocks.withScope.mockImplementationOnce(() => {
      throw new Error("Sentry SDK crash");
    });
    const { captureException } = await import("./lib/sentry");
    // Should not throw
    expect(() => captureException(new Error("test"))).not.toThrow();
    delete process.env.SENTRY_DSN;
  });

  it("should strip authorization headers in beforeSend", async () => {
    process.env.SENTRY_DSN = "https://test@sentry.io/123";
    const { initSentry } = await import("./lib/sentry");
    initSentry();

    // Get the beforeSend callback from the init call
    const initCall = sentryMocks.init.mock.calls[0]?.[0];
    expect(initCall).toBeDefined();
    expect(initCall.beforeSend).toBeDefined();

    const event = {
      request: {
        headers: {
          authorization: "Bearer secret",
          cookie: "session=abc",
          "content-type": "application/json",
        },
      },
    };

    const result = initCall.beforeSend(event);
    expect(result.request.headers.authorization).toBeUndefined();
    expect(result.request.headers.cookie).toBeUndefined();
    expect(result.request.headers["content-type"]).toBe("application/json");
    delete process.env.SENTRY_DSN;
  });
});
