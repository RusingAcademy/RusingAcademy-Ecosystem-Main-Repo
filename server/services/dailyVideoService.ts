// server/services/dailyVideoService.ts — Phase 10.1: Daily.co Video Integration
import axios, { AxiosError } from "axios";
import { createLogger } from "../logger";

const log = createLogger("services-dailyVideo");

export interface DailyRoom {
  id: string;
  name: string;
  url: string;
  privacy: string;
  created_at: string;
}

export interface DailyToken {
  token: string;
}

export class DailyVideoService {
  private apiKey: string;
  private baseUrl = "https://api.daily.co/v1";

  constructor() {
    this.apiKey = process.env.DAILY_API_KEY || "";
    if (!this.apiKey) {
      log.warn("DAILY_API_KEY not set — video features will be unavailable");
    }
  }

  /** Check if Daily.co integration is configured */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /** Create a private video room for a group session */
  async createRoom(sessionId: number | string, options?: {
    maxParticipants?: number;
    enableChat?: boolean;
    enableScreenshare?: boolean;
    expiryMinutes?: number;
  }): Promise<{ url: string; roomName: string }> {
    if (!this.isConfigured()) {
      throw new Error("Daily.co API key not configured");
    }

    const roomName = `group-session-${sessionId}`;
    const maxParticipants = options?.maxParticipants ?? 20;
    const enableChat = options?.enableChat ?? true;
    const enableScreenshare = options?.enableScreenshare ?? true;
    const expiryMinutes = options?.expiryMinutes ?? 180; // 3 hours default

    try {
      const response = await axios.post<DailyRoom>(
        `${this.baseUrl}/rooms`,
        {
          name: roomName,
          privacy: "private",
          properties: {
            max_participants: maxParticipants,
            enable_chat: enableChat,
            enable_screenshare: enableScreenshare,
            exp: Math.floor(Date.now() / 1000) + expiryMinutes * 60,
            enable_recording: "cloud",
            enable_prejoin_ui: true,
            enable_knocking: false,
            enable_network_ui: true,
          },
        },
        {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }
      );

      log.info(`Created Daily.co room: ${roomName}`, { url: response.data.url });
      return { url: response.data.url, roomName: response.data.name };
    } catch (error) {
      const axiosError = error as AxiosError;
      // If room already exists, fetch it
      if (axiosError.response?.status === 400) {
        try {
          const existing = await this.getRoom(roomName);
          return { url: existing.url, roomName: existing.name };
        } catch {
          throw new Error(`Failed to create or fetch Daily.co room: ${axiosError.message}`);
        }
      }
      log.error(`Failed to create Daily.co room: ${axiosError.message}`);
      throw new Error(`Failed to create Daily.co room: ${axiosError.message}`);
    }
  }

  /** Get an existing room by name */
  async getRoom(roomName: string): Promise<DailyRoom> {
    if (!this.isConfigured()) {
      throw new Error("Daily.co API key not configured");
    }

    const response = await axios.get<DailyRoom>(
      `${this.baseUrl}/rooms/${roomName}`,
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      }
    );
    return response.data;
  }

  /** Create a meeting token for a participant */
  async createToken(roomName: string, options?: {
    isOwner?: boolean;
    userName?: string;
    userId?: string;
    expiryMinutes?: number;
  }): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("Daily.co API key not configured");
    }

    const isOwner = options?.isOwner ?? false;
    const expiryMinutes = options?.expiryMinutes ?? 180;

    try {
      const response = await axios.post<DailyToken>(
        `${this.baseUrl}/meeting-tokens`,
        {
          properties: {
            room_name: roomName,
            is_owner: isOwner,
            user_name: options?.userName || "Participant",
            user_id: options?.userId || undefined,
            exp: Math.floor(Date.now() / 1000) + expiryMinutes * 60,
            enable_screenshare: true,
          },
        },
        {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }
      );

      return response.data.token;
    } catch (error) {
      const axiosError = error as AxiosError;
      log.error(`Failed to create Daily.co token: ${axiosError.message}`);
      throw new Error(`Failed to create Daily.co token: ${axiosError.message}`);
    }
  }

  /** Delete a room when session is complete */
  async deleteRoom(sessionId: number | string): Promise<void> {
    if (!this.isConfigured()) return;

    const roomName = `group-session-${sessionId}`;
    try {
      await axios.delete(`${this.baseUrl}/rooms/${roomName}`, {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
      log.info(`Deleted Daily.co room: ${roomName}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      // Room might not exist — that's OK
      if (axiosError.response?.status !== 404) {
        log.error(`Failed to delete Daily.co room: ${axiosError.message}`);
      }
    }
  }

  /** Get room usage/analytics */
  async getRoomPresence(roomName: string): Promise<{ total_count: number }> {
    if (!this.isConfigured()) {
      return { total_count: 0 };
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/rooms/${roomName}/presence`,
        {
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }
      );
      return response.data;
    } catch {
      return { total_count: 0 };
    }
  }
}

// Singleton instance
export const dailyVideoService = new DailyVideoService();
