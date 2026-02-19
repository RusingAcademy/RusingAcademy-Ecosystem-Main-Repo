/**
 * Chat Service — Phase 2
 * Backend service for group/course/community chat rooms with real-time messaging
 */
import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { getDb } from "../db";
import {
  chatRooms,
  chatMessages,
  chatRoomMembers,
  users,
} from "../../drizzle/schema";
import { getIO } from "../websocket";

// ─── Types ─────────────────────────────────────────────────────────────
export interface CreateRoomInput {
  name: string;
  type: "direct" | "course" | "module" | "community";
  referenceId?: number;
  memberIds?: number[];
}

export interface SendMessageInput {
  roomId: number;
  content: string;
  messageType?: "text" | "image" | "file" | "system";
  replyToId?: number;
}

// ─── Room Management ───────────────────────────────────────────────────

export async function createRoom(
  createdBy: number,
  input: CreateRoomInput
) {
  const db = await getDb();

  const [room] = await db.insert(chatRooms).values({
    name: input.name,
    type: input.type,
    referenceId: input.referenceId ?? null,
    createdBy,
    isActive: true,
  });

  const roomId = room.insertId;

  // Add creator as admin
  await db.insert(chatRoomMembers).values({
    roomId: Number(roomId),
    userId: createdBy,
    role: "admin",
  });

  // Add additional members
  if (input.memberIds && input.memberIds.length > 0) {
    const memberValues = input.memberIds
      .filter((id) => id !== createdBy)
      .map((userId) => ({
        roomId: Number(roomId),
        userId,
        role: "member" as const,
      }));

    if (memberValues.length > 0) {
      await db.insert(chatRoomMembers).values(memberValues);
    }
  }

  return { id: Number(roomId), name: input.name, type: input.type };
}

export async function getUserRooms(userId: number) {
  const db = await getDb();

  const memberships = await db
    .select({
      roomId: chatRoomMembers.roomId,
      role: chatRoomMembers.role,
      lastReadAt: chatRoomMembers.lastReadAt,
      roomName: chatRooms.name,
      roomType: chatRooms.type,
      isActive: chatRooms.isActive,
    })
    .from(chatRoomMembers)
    .innerJoin(chatRooms, eq(chatRoomMembers.roomId, chatRooms.id))
    .where(
      and(
        eq(chatRoomMembers.userId, userId),
        eq(chatRooms.isActive, true)
      )
    );

  // Get unread counts for each room
  const roomsWithUnread = await Promise.all(
    memberships.map(async (m) => {
      const unreadResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(chatMessages)
        .where(
          and(
            eq(chatMessages.roomId, m.roomId),
            eq(chatMessages.isDeleted, false),
            m.lastReadAt
              ? sql`${chatMessages.createdAt} > ${m.lastReadAt}`
              : sql`1=1`
          )
        );

      return {
        id: m.roomId,
        name: m.roomName,
        type: m.roomType,
        role: m.role,
        unreadCount: unreadResult[0]?.count ?? 0,
      };
    })
  );

  return roomsWithUnread;
}

export async function getRoomMembers(roomId: number) {
  const db = await getDb();

  return db
    .select({
      userId: chatRoomMembers.userId,
      role: chatRoomMembers.role,
      joinedAt: chatRoomMembers.joinedAt,
      userName: users.name,
      avatarUrl: users.avatarUrl,
    })
    .from(chatRoomMembers)
    .innerJoin(users, eq(chatRoomMembers.userId, users.id))
    .where(eq(chatRoomMembers.roomId, roomId));
}

// ─── Messaging ─────────────────────────────────────────────────────────

export async function sendMessage(
  senderId: number,
  input: SendMessageInput
) {
  const db = await getDb();

  // Verify sender is a member of the room
  const membership = await db
    .select()
    .from(chatRoomMembers)
    .where(
      and(
        eq(chatRoomMembers.roomId, input.roomId),
        eq(chatRoomMembers.userId, senderId)
      )
    )
    .limit(1);

  if (membership.length === 0) {
    throw new Error("Not a member of this room");
  }

  // Insert message
  const [result] = await db.insert(chatMessages).values({
    roomId: input.roomId,
    senderId,
    content: input.content,
    messageType: input.messageType ?? "text",
    replyToId: input.replyToId ?? null,
  });

  const messageId = Number(result.insertId);

  // Get sender info for broadcast
  const senderInfo = await db
    .select({ name: users.name, avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.id, senderId))
    .limit(1);

  const message = {
    id: messageId,
    roomId: input.roomId,
    senderId,
    senderName: senderInfo[0]?.name ?? "Unknown",
    senderAvatar: senderInfo[0]?.avatarUrl ?? null,
    content: input.content,
    messageType: input.messageType ?? "text",
    replyToId: input.replyToId ?? null,
    createdAt: new Date().toISOString(),
  };

  // Broadcast via WebSocket
  broadcastMessage(input.roomId, message);

  return message;
}

export async function getRoomMessages(
  roomId: number,
  limit = 50,
  before?: number
) {
  const db = await getDb();

  const conditions = [
    eq(chatMessages.roomId, roomId),
    eq(chatMessages.isDeleted, false),
  ];

  if (before) {
    conditions.push(sql`${chatMessages.id} < ${before}`);
  }

  const msgs = await db
    .select({
      id: chatMessages.id,
      roomId: chatMessages.roomId,
      senderId: chatMessages.senderId,
      senderName: users.name,
      senderAvatar: users.avatarUrl,
      content: chatMessages.content,
      messageType: chatMessages.messageType,
      replyToId: chatMessages.replyToId,
      isEdited: chatMessages.isEdited,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .innerJoin(users, eq(chatMessages.senderId, users.id))
    .where(and(...conditions))
    .orderBy(desc(chatMessages.id))
    .limit(limit);

  return msgs.reverse(); // Return in chronological order
}

export async function markRoomAsRead(userId: number, roomId: number) {
  const db = await getDb();

  await db
    .update(chatRoomMembers)
    .set({ lastReadAt: new Date() })
    .where(
      and(
        eq(chatRoomMembers.roomId, roomId),
        eq(chatRoomMembers.userId, userId)
      )
    );

  return { success: true };
}

export async function editMessage(
  userId: number,
  messageId: number,
  newContent: string
) {
  const db = await getDb();

  // Verify ownership
  const msg = await db
    .select()
    .from(chatMessages)
    .where(
      and(eq(chatMessages.id, messageId), eq(chatMessages.senderId, userId))
    )
    .limit(1);

  if (msg.length === 0) {
    throw new Error("Message not found or not authorized");
  }

  await db
    .update(chatMessages)
    .set({ content: newContent, isEdited: true })
    .where(eq(chatMessages.id, messageId));

  // Broadcast edit
  broadcastMessageEdit(msg[0].roomId, messageId, newContent);

  return { success: true };
}

export async function deleteMessage(userId: number, messageId: number) {
  const db = await getDb();

  const msg = await db
    .select()
    .from(chatMessages)
    .where(
      and(eq(chatMessages.id, messageId), eq(chatMessages.senderId, userId))
    )
    .limit(1);

  if (msg.length === 0) {
    throw new Error("Message not found or not authorized");
  }

  await db
    .update(chatMessages)
    .set({ isDeleted: true })
    .where(eq(chatMessages.id, messageId));

  // Broadcast deletion
  broadcastMessageDelete(msg[0].roomId, messageId);

  return { success: true };
}

// ─── WebSocket Broadcasts ──────────────────────────────────────────────

function broadcastMessage(roomId: number, message: any): void {
  try {
    const io = getIO();
    if (!io) return;
    io.to(`chat:${roomId}`).emit("chat:message", message);
  } catch {
    // WebSocket not available
  }
}

function broadcastMessageEdit(
  roomId: number,
  messageId: number,
  newContent: string
): void {
  try {
    const io = getIO();
    if (!io) return;
    io.to(`chat:${roomId}`).emit("chat:message-edited", {
      messageId,
      newContent,
      editedAt: new Date().toISOString(),
    });
  } catch {
    // WebSocket not available
  }
}

function broadcastMessageDelete(roomId: number, messageId: number): void {
  try {
    const io = getIO();
    if (!io) return;
    io.to(`chat:${roomId}`).emit("chat:message-deleted", { messageId });
  } catch {
    // WebSocket not available
  }
}
