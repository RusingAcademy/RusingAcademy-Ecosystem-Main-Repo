// server/dailyVideoService.test.ts — Phase 10.1: Daily.co Video Service Tests
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock axios before importing the service
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

import axios from "axios";
import { DailyVideoService } from "./services/dailyVideoService";

describe("DailyVideoService", () => {
  let service: DailyVideoService;

  beforeEach(() => {
    vi.clearAllMocks();
    // Set the env var for tests
    process.env.DAILY_API_KEY = "test-api-key";
    service = new DailyVideoService();
  });

  describe("isConfigured", () => {
    it("should return true when DAILY_API_KEY is set", () => {
      expect(service.isConfigured()).toBe(true);
    });

    it("should return false when DAILY_API_KEY is not set", () => {
      delete process.env.DAILY_API_KEY;
      const unconfigured = new DailyVideoService();
      expect(unconfigured.isConfigured()).toBe(false);
    });
  });

  describe("createRoom", () => {
    it("should create a room with correct parameters", async () => {
      const mockRoom = {
        id: "room-123",
        name: "group-session-42",
        url: "https://rusingacademy.daily.co/group-session-42",
        privacy: "private",
        created_at: "2026-02-19T00:00:00Z",
      };

      (axios.post as any).mockResolvedValueOnce({ data: mockRoom });

      const result = await service.createRoom(42, {
        maxParticipants: 20,
        enableChat: true,
        enableScreenshare: true,
      });

      expect(result.url).toBe(mockRoom.url);
      expect(result.roomName).toBe("group-session-42");
      expect(axios.post).toHaveBeenCalledWith(
        "https://api.daily.co/v1/rooms",
        expect.objectContaining({
          name: "group-session-42",
          privacy: "private",
        }),
        expect.objectContaining({
          headers: { Authorization: "Bearer test-api-key" },
        })
      );
    });

    it("should throw when not configured", async () => {
      delete process.env.DAILY_API_KEY;
      const unconfigured = new DailyVideoService();
      await expect(unconfigured.createRoom(1)).rejects.toThrow("Daily.co API key not configured");
    });
  });

  describe("createToken", () => {
    it("should create a meeting token", async () => {
      (axios.post as any).mockResolvedValueOnce({ data: { token: "test-token-123" } });

      const token = await service.createToken("group-session-42", {
        isOwner: false,
        userName: "Test User",
      });

      expect(token).toBe("test-token-123");
      expect(axios.post).toHaveBeenCalledWith(
        "https://api.daily.co/v1/meeting-tokens",
        expect.objectContaining({
          properties: expect.objectContaining({
            room_name: "group-session-42",
            is_owner: false,
            user_name: "Test User",
          }),
        }),
        expect.any(Object)
      );
    });
  });

  describe("deleteRoom", () => {
    it("should delete a room", async () => {
      (axios.delete as any).mockResolvedValueOnce({ data: {} });

      await service.deleteRoom(42);

      expect(axios.delete).toHaveBeenCalledWith(
        "https://api.daily.co/v1/rooms/group-session-42",
        expect.objectContaining({
          headers: { Authorization: "Bearer test-api-key" },
        })
      );
    });

    it("should not throw when room does not exist (404)", async () => {
      (axios.delete as any).mockRejectedValueOnce({
        response: { status: 404 },
        message: "Not found",
      });

      // Should not throw
      await service.deleteRoom(999);
    });
  });

  describe("getRoomPresence", () => {
    it("should return participant count", async () => {
      (axios.get as any).mockResolvedValueOnce({ data: { total_count: 5 } });

      const presence = await service.getRoomPresence("group-session-42");
      expect(presence.total_count).toBe(5);
    });

    it("should return 0 when not configured", async () => {
      delete process.env.DAILY_API_KEY;
      const unconfigured = new DailyVideoService();
      const presence = await unconfigured.getRoomPresence("test");
      expect(presence.total_count).toBe(0);
    });
  });
});
