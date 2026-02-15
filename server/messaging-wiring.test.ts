import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { TRPCError } from "@trpc/server";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(overrides?: Partial<AuthenticatedUser>): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-open-id",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Message Router — Authentication Guards", () => {
  it("message.conversations rejects unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.message.conversations()).rejects.toThrow(TRPCError);
  });

  it("message.unreadCount rejects unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.message.unreadCount()).rejects.toThrow(TRPCError);
  });

  it("message.list rejects unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.message.list({ conversationId: 1 })
    ).rejects.toThrow(TRPCError);
  });

  it("message.send rejects unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.message.send({ conversationId: 1, content: "Hello" })
    ).rejects.toThrow(TRPCError);
  });

  it("message.markAsRead rejects unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.message.markAsRead({ conversationId: 1 })
    ).rejects.toThrow(TRPCError);
  });

  it("message.startConversation rejects unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.message.startConversation({ participantId: 2 })
    ).rejects.toThrow(TRPCError);
  });
});

describe("Message Router — Input Validation", () => {
  it("message.list requires conversationId as a number", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      // @ts-expect-error — testing invalid input
      caller.message.list({ conversationId: "not-a-number" })
    ).rejects.toThrow();
  });

  it("message.send requires both conversationId and content", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      // @ts-expect-error — testing missing content
      caller.message.send({ conversationId: 1 })
    ).rejects.toThrow();
  });

  it("message.startConversation requires participantId as a number", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      // @ts-expect-error — testing invalid input
      caller.message.startConversation({ participantId: "abc" })
    ).rejects.toThrow();
  });
});

describe("Message Router — Procedure Registration", () => {
  it("all 6 message procedures are registered on the router", () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Verify all procedures exist as callable methods
    expect(typeof caller.message.conversations).toBe("function");
    expect(typeof caller.message.list).toBe("function");
    expect(typeof caller.message.send).toBe("function");
    expect(typeof caller.message.markAsRead).toBe("function");
    expect(typeof caller.message.startConversation).toBe("function");
    expect(typeof caller.message.unreadCount).toBe("function");
  });
});

describe("Message Router — Authenticated Calls (DB-dependent)", () => {
  it("message.conversations returns an array for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This will hit the real DB — should return empty array for test user
    const result = await caller.message.conversations();
    expect(Array.isArray(result)).toBe(true);
  });

  it("message.unreadCount returns a count object for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.message.unreadCount();
    expect(result).toHaveProperty("count");
    expect(typeof result.count).toBe("number");
    expect(result.count).toBeGreaterThanOrEqual(0);
  });

  it("message.list returns an array for a valid conversationId", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Conversation 0 won't exist but should return empty array, not crash
    const result = await caller.message.list({ conversationId: 999999 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Coach Router — userId in list response", () => {
  it("coach.list returns coaches with userId field", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const coaches = await caller.coach.list({});
    expect(Array.isArray(coaches)).toBe(true);
    
    if (coaches.length > 0) {
      const firstCoach = coaches[0];
      expect(firstCoach).toHaveProperty("userId");
      expect(typeof firstCoach.userId).toBe("number");
    }
  });
});
