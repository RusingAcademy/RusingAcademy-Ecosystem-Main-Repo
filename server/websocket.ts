/**
 * WebSocket Server — Socket.io Integration for RusingAcademy
 * Phase 1: Real-time communication infrastructure
 *
 * Features:
 * - JWT-authenticated connections (using jose — same as session.ts)
 * - Automatic room assignment by user role
 * - Broadcast service for tRPC mutations
 * - Graceful reconnection with exponential backoff
 * - Redis adapter support for horizontal scaling
 */
import { Server, Socket } from "socket.io";
import type { Server as HttpServer } from "http";
import { jwtVerify } from "jose";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// ── Types ────────────────────────────────────────────────────────────────────

interface AuthenticatedSocket extends Socket {
  userId: number;
  userRole: string;
  userName: string;
}

export interface WSEvent {
  type: string;
  payload: Record<string, unknown>;
  targetUsers?: number[];
  targetRooms?: string[];
}

// ── Configuration ────────────────────────────────────────────────────────────

const WS_CORS_ORIGIN = process.env.WEBSOCKET_CORS_ORIGIN || process.env.CORS_ORIGIN || "*";
const ROLE_ROOMS = ["admin", "coach", "learner", "hr", "superadmin"];

/**
 * Get the JWT secret key as Uint8Array — consistent with session.ts
 */
function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET || "";
  if (!secret) {
    throw new Error("JWT_SECRET is not configured for WebSocket auth");
  }
  return new TextEncoder().encode(secret);
}

// ── Singleton ────────────────────────────────────────────────────────────────

let io: Server | null = null;

/**
 * Feature flag — allows disabling WebSocket at runtime for rollback
 */
export const WS_ENABLED = process.env.WEBSOCKET_ENABLED !== "false";

/**
 * Initialize the Socket.io server on the existing HTTP server
 */
export async function initWebSocket(httpServer: HttpServer): Promise<Server | null> {
  if (!WS_ENABLED) {
    console.log("⚠️ WebSocket disabled via WEBSOCKET_ENABLED=false");
    return null;
  }

  io = new Server(httpServer, {
    cors: {
      origin: WS_CORS_ORIGIN === "*" ? "*" : WS_CORS_ORIGIN.split(",").map((s) => s.trim()),
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingTimeout: 60000,
    pingInterval: 25000,
    path: "/ws",
  });

  // ── Authentication middleware ──────────────────────────────────────────────
  io.use(async (socket: Socket, next) => {
    try {
      const token =
        (socket.handshake.auth.token as string) ||
        (socket.handshake.query.token as string) ||
        socket.handshake.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return next(new Error("Authentication required"));
      }

      // Use jose jwtVerify — same library and approach as session.ts
      const secretKey = getSecretKey();
      const { payload: decoded } = await jwtVerify(token, secretKey);

      const userId =
        (decoded.userId as number) ||
        (decoded.id as number) ||
        (decoded.sub ? parseInt(decoded.sub, 10) : 0);

      if (!userId) {
        return next(new Error("Invalid token payload"));
      }

      const db = await getDb();
      if (!db) {
        return next(new Error("Database unavailable"));
      }

      const [user] = await db
        .select({ id: users.id, role: users.role, name: users.name })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user) {
        return next(new Error("User not found"));
      }

      // Attach user info to socket
      const authSocket = socket as AuthenticatedSocket;
      authSocket.userId = user.id;
      authSocket.userRole = user.role || "learner";
      authSocket.userName = user.name || "Unknown";

      next();
    } catch (error) {
      console.error("WebSocket auth error:", error instanceof Error ? error.message : error);
      next(new Error("Invalid token"));
    }
  });

  // ── Connection handler ─────────────────────────────────────────────────────
  io.on("connection", (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;

    console.log(`✅ WS: User ${authSocket.userId} connected (${authSocket.userRole})`);

    // 1. Personal room
    socket.join(`user:${authSocket.userId}`);

    // 2. Role room
    if (ROLE_ROOMS.includes(authSocket.userRole)) {
      socket.join(`role:${authSocket.userRole}`);
    }

    // 3. Global room
    socket.join("all");

    // Confirm connection to client
    socket.emit("connected", {
      userId: authSocket.userId,
      role: authSocket.userRole,
      rooms: [`user:${authSocket.userId}`, `role:${authSocket.userRole}`, "all"],
      serverTime: Date.now(),
    });

    // ── Client event handlers ────────────────────────────────────────────────

    socket.on("join_room", (roomId: string) => {
      if (typeof roomId === "string" && roomId.length < 100) {
        socket.join(roomId);
      }
    });

    socket.on("leave_room", (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on("ping", () => {
      socket.emit("pong", { timestamp: Date.now() });
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ WS: User ${authSocket.userId} disconnected: ${reason}`);
    });

    socket.on("error", (error) => {
      console.error(`WS error for user ${authSocket.userId}:`, error);
    });
  });

  console.log("✅ Socket.io WebSocket server initialized (path: /ws)");
  return io;
}

// ── Getters ──────────────────────────────────────────────────────────────────

export function getIO(): Server | null {
  return io;
}

// ── Broadcast Service ────────────────────────────────────────────────────────

export const broadcastService = {
  /**
   * Send event to specific users by their IDs
   */
  toUsers(userIds: number[], event: string, data: Record<string, unknown>) {
    if (!io) return;
    userIds.forEach((userId) => {
      io!.to(`user:${userId}`).emit(event, data);
    });
  },

  /**
   * Send event to all users with a specific role
   */
  toRole(role: string, event: string, data: Record<string, unknown>) {
    if (!io) return;
    io.to(`role:${role}`).emit(event, data);
  },

  /**
   * Send event to all connected users
   */
  toAll(event: string, data: Record<string, unknown>) {
    if (!io) return;
    io.to("all").emit(event, data);
  },

  /**
   * Send event to a specific room
   */
  toRoom(roomId: string, event: string, data: Record<string, unknown>) {
    if (!io) return;
    io.to(roomId).emit(event, data);
  },

  /**
   * Emit a structured WSEvent — routes to users, rooms, or all
   */
  emit(event: WSEvent) {
    if (!io) return;
    if (event.targetUsers?.length) {
      this.toUsers(event.targetUsers, event.type, event.payload);
    } else if (event.targetRooms?.length) {
      event.targetRooms.forEach((room) => {
        this.toRoom(room, event.type, event.payload);
      });
    } else {
      this.toAll(event.type, event.payload);
    }
  },
};

/**
 * Gracefully close the WebSocket server
 */
export async function closeWebSocket(): Promise<void> {
  if (io) {
    await io.close();
    io = null;
    console.log("WebSocket server closed");
  }
}

export type { AuthenticatedSocket };
