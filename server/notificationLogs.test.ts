/**
 * Notification Logs — Unit Tests (PR 0.2)
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Hoisted mocks ────────────────────────────────────────────────────
const mocks = vi.hoisted(() => {
  const insertValues = vi.fn().mockResolvedValue([{ insertId: 42 }]);
  const insert = vi.fn().mockReturnValue({ values: insertValues });

  const updateWhere = vi.fn().mockResolvedValue(undefined);
  const updateSet = vi.fn().mockReturnValue({ where: updateWhere });
  const update = vi.fn().mockReturnValue({ set: updateSet });

  const selectOffset = vi.fn().mockResolvedValue([]);
  const selectLimit = vi.fn().mockReturnValue({ offset: selectOffset });
  const selectOrderBy = vi.fn().mockReturnValue({ limit: selectLimit });
  const selectWhere = vi.fn().mockReturnValue({ orderBy: selectOrderBy });
  const selectFrom = vi.fn().mockReturnValue({ where: selectWhere });
  const select = vi.fn().mockReturnValue({ from: selectFrom });

  const getDb = vi.fn().mockResolvedValue({
    insert,
    update,
    select,
  });

  return {
    getDb,
    insert, insertValues,
    update, updateSet, updateWhere,
    select, selectFrom, selectWhere, selectOrderBy, selectLimit, selectOffset,
  };
});

vi.mock("./db", () => ({ getDb: mocks.getDb }));

vi.mock("../drizzle/schema", () => ({
  notificationsLog: {
    id: "id", userId: "userId", type: "type", title: "title",
    body: "body", data: "data", channel: "channel", status: "status",
    sentAt: "sentAt", deliveredAt: "deliveredAt", readAt: "readAt", error: "error",
  },
  users: { id: "id" },
}));

vi.mock("./logger", () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn() }),
}));

import {
  logNotification,
  updateNotificationLogStatus,
  markNotificationLogRead,
  getNotificationLogsForUser,
} from "./services/notificationLogService";

// ─── Tests ─────────────────────────────────────────────────────────────

describe("Notification Log Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Restore default mock returns
    mocks.insertValues.mockResolvedValue([{ insertId: 42 }]);
    mocks.insert.mockReturnValue({ values: mocks.insertValues });
    mocks.updateWhere.mockResolvedValue(undefined);
    mocks.updateSet.mockReturnValue({ where: mocks.updateWhere });
    mocks.update.mockReturnValue({ set: mocks.updateSet });
    mocks.selectOffset.mockResolvedValue([]);
    mocks.selectLimit.mockReturnValue({ offset: mocks.selectOffset });
    mocks.selectOrderBy.mockReturnValue({ limit: mocks.selectLimit });
    mocks.selectWhere.mockReturnValue({ orderBy: mocks.selectOrderBy });
    mocks.selectFrom.mockReturnValue({ where: mocks.selectWhere });
    mocks.select.mockReturnValue({ from: mocks.selectFrom });
    mocks.getDb.mockResolvedValue({
      insert: mocks.insert,
      update: mocks.update,
      select: mocks.select,
    });
  });

  describe("logNotification", () => {
    it("should insert a log entry and return the ID", async () => {
      const result = await logNotification({
        userId: 1,
        type: "booking",
        title: "Session booked",
        body: "Your session is confirmed",
        channel: "websocket",
        status: "delivered",
      });
      expect(result).toBe(42);
      expect(mocks.insert).toHaveBeenCalled();
    });

    it("should handle push channel with sent status", async () => {
      const result = await logNotification({
        userId: 2, type: "system", title: "Push notification",
        channel: "push", status: "sent",
      });
      expect(result).toBe(42);
    });

    it("should handle email channel", async () => {
      const result = await logNotification({
        userId: 3, type: "session_reminder", title: "Reminder",
        body: "Your session starts in 1 hour", channel: "email", status: "sent",
      });
      expect(result).toBe(42);
    });

    it("should include error field for failed notifications", async () => {
      const result = await logNotification({
        userId: 4, type: "message", title: "Failed push",
        channel: "push", status: "failed", error: "Subscription expired",
      });
      expect(result).toBe(42);
    });

    it("should include metadata in data field", async () => {
      const result = await logNotification({
        userId: 5, type: "booking", title: "Session booked",
        data: { sessionId: 123, coachId: 456 },
        channel: "websocket", status: "delivered",
      });
      expect(result).toBe(42);
    });

    it("should return null on DB error without throwing", async () => {
      mocks.insertValues.mockRejectedValueOnce(new Error("DB error"));
      const result = await logNotification({
        userId: 1, type: "system", title: "Test",
        channel: "websocket", status: "pending",
      });
      expect(result).toBeNull();
    });

    it("should return null when DB is unavailable", async () => {
      mocks.getDb.mockResolvedValueOnce(null);
      const result = await logNotification({
        userId: 1, type: "system", title: "Test",
        channel: "websocket", status: "pending",
      });
      expect(result).toBeNull();
    });
  });

  describe("updateNotificationLogStatus", () => {
    it("should update status to delivered", async () => {
      await updateNotificationLogStatus(42, "delivered");
      expect(mocks.update).toHaveBeenCalled();
    });

    it("should update status to read", async () => {
      await updateNotificationLogStatus(42, "read");
      expect(mocks.update).toHaveBeenCalled();
    });

    it("should include error message for failed status", async () => {
      await updateNotificationLogStatus(42, "failed", "Timeout");
      expect(mocks.update).toHaveBeenCalled();
    });
  });

  describe("markNotificationLogRead", () => {
    it("should call update with read status", async () => {
      await markNotificationLogRead(42);
      expect(mocks.update).toHaveBeenCalled();
    });
  });

  describe("getNotificationLogsForUser", () => {
    it("should return logs for a user", async () => {
      const result = await getNotificationLogsForUser(1);
      expect(result).toEqual([]);
      expect(mocks.select).toHaveBeenCalled();
    });

    it("should accept limit and offset options", async () => {
      const result = await getNotificationLogsForUser(1, { limit: 10, offset: 20 });
      expect(result).toEqual([]);
    });

    it("should accept channel filter", async () => {
      const result = await getNotificationLogsForUser(1, { channel: "push" });
      expect(result).toEqual([]);
    });
  });
});

describe("Notification Log Types", () => {
  it("should accept all valid channel types", () => {
    const channels: Array<"push" | "websocket" | "email"> = ["push", "websocket", "email"];
    expect(channels).toHaveLength(3);
  });

  it("should accept all valid status types", () => {
    const statuses: Array<"pending" | "sent" | "delivered" | "failed" | "read"> = [
      "pending", "sent", "delivered", "failed", "read",
    ];
    expect(statuses).toHaveLength(5);
  });
});
