/**
 * ChatRoom Component — Phase 2
 * Real-time group chat with WebSocket integration
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { trpc } from "../lib/trpc";
import { useWebSocket } from "../hooks/useWebSocket";
import { useAuth } from "../hooks/useAuth";
import { Send, Edit2, Trash2, Reply, Users, X } from "lucide-react";

interface ChatMessage {
  id: number;
  roomId: number;
  senderId: number;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  messageType: string;
  replyToId: number | null;
  isEdited?: boolean;
  createdAt: string;
}

interface ChatRoomProps {
  roomId: number;
  roomName: string;
  onClose?: () => void;
}

export function ChatRoom({ roomId, roomName, onClose }: ChatRoomProps) {
  const { user } = useAuth();
  const { socket } = useWebSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // tRPC queries and mutations
  const messagesQuery = trpc.chat.getMessages.useQuery(
    { roomId, limit: 50 },
    { enabled: !!roomId }
  );
  const sendMutation = trpc.chat.sendMessage.useMutation();
  const editMutation = trpc.chat.editMessage.useMutation();
  const deleteMutation = trpc.chat.deleteMessage.useMutation();
  const markReadMutation = trpc.chat.markAsRead.useMutation();

  // Load initial messages
  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data as ChatMessage[]);
      setIsLoading(false);
    }
  }, [messagesQuery.data]);

  // Join room via WebSocket
  useEffect(() => {
    if (!socket) return;

    socket.emit("join-room", `chat:${roomId}`);

    // Listen for new messages
    const handleNewMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleMessageEdited = (data: { messageId: number; newContent: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === data.messageId
            ? { ...m, content: data.newContent, isEdited: true }
            : m
        )
      );
    };

    const handleMessageDeleted = (data: { messageId: number }) => {
      setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
    };

    socket.on("chat:message", handleNewMessage);
    socket.on("chat:message-edited", handleMessageEdited);
    socket.on("chat:message-deleted", handleMessageDeleted);

    // Mark as read on enter
    markReadMutation.mutate({ roomId });

    return () => {
      socket.emit("leave-room", `chat:${roomId}`);
      socket.off("chat:message", handleNewMessage);
      socket.off("chat:message-edited", handleMessageEdited);
      socket.off("chat:message-deleted", handleMessageDeleted);
    };
  }, [socket, roomId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = useCallback(async () => {
    if (!newMessage.trim()) return;

    try {
      await sendMutation.mutateAsync({
        roomId,
        content: newMessage.trim(),
        replyToId: replyTo?.id,
      });
      setNewMessage("");
      setReplyTo(null);
      inputRef.current?.focus();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  }, [newMessage, roomId, replyTo, sendMutation]);

  // Edit message
  const handleEdit = useCallback(async () => {
    if (!editingId || !editContent.trim()) return;

    try {
      await editMutation.mutateAsync({
        messageId: editingId,
        content: editContent.trim(),
      });
      setEditingId(null);
      setEditContent("");
    } catch (err) {
      console.error("Failed to edit message:", err);
    }
  }, [editingId, editContent, editMutation]);

  // Delete message
  const handleDelete = useCallback(
    async (messageId: number) => {
      try {
        await deleteMutation.mutateAsync({ messageId });
      } catch (err) {
        console.error("Failed to delete message:", err);
      }
    },
    [deleteMutation]
  );

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-t-xl">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{roomName}</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === user?.id;

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isOwn
                      ? "bg-violet-600 text-white rounded-br-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md"
                  }`}
                >
                  {/* Sender name (for others) */}
                  {!isOwn && (
                    <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">
                      {msg.senderName}
                    </p>
                  )}

                  {/* Reply indicator */}
                  {msg.replyToId && (
                    <div className="text-xs opacity-70 border-l-2 border-current pl-2 mb-1 italic">
                      Replying to message...
                    </div>
                  )}

                  {/* Message content */}
                  {editingId === msg.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                        className="flex-1 bg-white/20 rounded px-2 py-1 text-sm"
                        autoFocus
                      />
                      <button onClick={handleEdit} className="text-xs underline">
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-xs underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}

                  {/* Metadata */}
                  <div
                    className={`flex items-center gap-2 mt-1 text-xs ${
                      isOwn ? "text-white/60" : "text-gray-400"
                    }`}
                  >
                    <span>{formatTime(msg.createdAt)}</span>
                    {msg.isEdited && <span>(edited)</span>}
                  </div>

                  {/* Actions (own messages) */}
                  {isOwn && editingId !== msg.id && (
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={() => setReplyTo(msg)}
                        className="p-1 rounded hover:bg-white/20 transition-colors"
                        title="Reply"
                      >
                        <Reply className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(msg.id);
                          setEditContent(msg.content);
                        }}
                        className="p-1 rounded hover:bg-white/20 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="p-1 rounded hover:bg-white/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Reply action for others */}
                  {!isOwn && (
                    <button
                      onClick={() => setReplyTo(msg)}
                      className="p-1 mt-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="Reply"
                    >
                      <Reply className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply indicator */}
      {replyTo && (
        <div className="px-4 py-2 bg-violet-50 dark:bg-violet-950/30 border-t border-violet-100 dark:border-violet-900 flex items-center justify-between">
          <span className="text-sm text-violet-600 dark:text-violet-400">
            Replying to <strong>{replyTo.senderName}</strong>: {replyTo.content.slice(0, 50)}...
          </span>
          <button onClick={() => setReplyTo(null)}>
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sendMutation.isPending}
            className="p-2 rounded-full bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
