// server/services/videoService.ts — Phase 3: Native Video Rooms (Daily.co)
import { getDb } from "../db";
import { sessions, sessionRecordings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { broadcastService } from "../websocket";
import { phase3Config } from "../config/phase3";
import { createLogger } from "../logger";

const log = createLogger("services-videoService");
const { apiKey, apiUrl, roomPrefix, maxParticipants, maxDurationMinutes, recordingEnabled } = phase3Config.video;

interface DailyRoom {
  id: string;
  name: string;
  url: string;
  created_at: string;
  config: Record<string, unknown>;
}

interface DailyMeetingToken {
  token: string;
}

// Simple in-memory cache for room lookups (no Redis available)
const roomCache = new Map<string, { room: DailyRoom; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const videoService = {
  // ========== Room Management ==========

  async createRoom(sessionId: number): Promise<{ url: string; roomName: string; expiresAt: Date }> {
    if (!phase3Config.video.enabled) {
      throw new Error("Native video is disabled");
    }

    const roomName = `${roomPrefix}${sessionId}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + maxDurationMinutes * 60 * 1000);

    const response = await fetch(`${apiUrl}/rooms`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: roomName,
        privacy: "private",
        properties: {
          max_participants: maxParticipants,
          exp: Math.floor(expiresAt.getTime() / 1000),
          enable_recording: recordingEnabled ? "cloud" : undefined,
          enable_chat: true,
          enable_screenshare: true,
          enable_knocking: true,
          start_audio_off: false,
          start_video_off: false,
          lang: "en",
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      log.error("[Video] Failed to create room:", error);
      throw new Error(`Failed to create video room: ${error}`);
    }

    const room = (await response.json()) as DailyRoom;

    // Update session with video room info
    const db = await getDb();
    await db.update(sessions).set({
      meetingUrl: room.url,
    }).where(eq(sessions.id, sessionId));

    // Cache the room
    roomCache.set(roomName, { room, expiresAt: Date.now() + CACHE_TTL });

    log.info(`[Video] Room created: ${roomName} for session ${sessionId}`);
    return { url: room.url, roomName, expiresAt };
  },

  async createMeetingToken(roomName: string, userId: number, userName: string, isOwner: boolean): Promise<string> {
    const response = await fetch(`${apiUrl}/meeting-tokens`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          room_name: roomName,
          user_name: userName,
          user_id: String(userId),
          is_owner: isOwner,
          enable_recording: isOwner && recordingEnabled ? "cloud" : undefined,
          exp: Math.floor(Date.now() / 1000) + maxDurationMinutes * 60,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      log.error("[Video] Failed to create meeting token:", error);
      throw new Error(`Failed to create meeting token: ${error}`);
    }

    const data = (await response.json()) as DailyMeetingToken;
    return data.token;
  },

  async getRoom(roomName: string): Promise<DailyRoom | null> {
    // Check cache first
    const cached = roomCache.get(roomName);
    if (cached && cached.expiresAt > Date.now()) return cached.room;

    const response = await fetch(`${apiUrl}/rooms/${roomName}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Failed to get room");

    const room = (await response.json()) as DailyRoom;
    roomCache.set(roomName, { room, expiresAt: Date.now() + CACHE_TTL });
    return room;
  },

  async deleteRoom(roomName: string): Promise<void> {
    await fetch(`${apiUrl}/rooms/${roomName}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    roomCache.delete(roomName);
    log.info(`[Video] Room deleted: ${roomName}`);
  },

  // ========== Session Video Lifecycle ==========

  async startSessionVideo(sessionId: number, coachId: number, coachName: string): Promise<{ url: string; token: string; roomName: string }> {
    const { url, roomName } = await this.createRoom(sessionId);
    const token = await this.createMeetingToken(roomName, coachId, coachName, true);

    // Notify learner that video room is ready
    const db2 = await getDb();
    const session = await db2.select().from(sessions).where(eq(sessions.id, sessionId)).then((r) => r[0]);
    if (session) {
      broadcastService.toUsers([session.learnerId], "video:room-ready", {
        sessionId,
        url,
        roomName,
      });
    }

    return { url, token, roomName };
  },

  async joinSessionVideo(sessionId: number, userId: number, userName: string): Promise<{ url: string; token: string }> {
    const db = await getDb();
    const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).then((r) => r[0]);
    if (!session?.meetingUrl) throw new Error("No video room for this session");

    // Extract room name from URL (https://domain.daily.co/room-name)
    const roomName = session.meetingUrl.split("/").pop() || "";
    const token = await this.createMeetingToken(roomName, userId, userName, false);

    return { url: session.meetingUrl, token };
  },

  async endSessionVideo(sessionId: number): Promise<void> {
    const db = await getDb();
    const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).then((r) => r[0]);
    if (!session?.meetingUrl) return;

    const roomName = session.meetingUrl.split("/").pop() || "";

    // Notify participants
    broadcastService.toUsers([session.coachId, session.learnerId], "video:room-ended", { sessionId });

    // Delete room after a grace period (handled by Daily.co expiry)
    log.info(`[Video] Session ${sessionId} video ended, room: ${roomName}`);
  },

  // ========== Recording Management ==========

  async saveRecording(sessionId: number, dailyRecordingId: string, durationSeconds: number): Promise<void> {
    const shareToken = Buffer.from(`${sessionId}-${Date.now()}`).toString("base64url").slice(0, 32);

    const db = await getDb();
    await db.insert(sessionRecordings).values({
      sessionId,
      dailyRecordingId,
      durationSeconds,
      shareToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    log.info(`[Video] Recording saved for session ${sessionId}: ${dailyRecordingId}`);
  },

  async getRecordings(sessionId: number) {
    const db = await getDb();
    return db.select().from(sessionRecordings).where(eq(sessionRecordings.sessionId, sessionId));
  },
};
