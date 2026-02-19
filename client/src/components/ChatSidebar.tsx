/**
 * ChatSidebar Component — Phase 2
 * Displays list of chat rooms with unread counts
 */
import { useState } from "react";
import { trpc } from "../lib/trpc";
import { MessageCircle, Hash, BookOpen, Users, Plus } from "lucide-react";

interface ChatSidebarProps {
  selectedRoomId: number | null;
  onSelectRoom: (roomId: number, roomName: string) => void;
  onCreateRoom?: () => void;
}

const roomTypeIcons: Record<string, React.ReactNode> = {
  direct: <MessageCircle className="w-4 h-4" />,
  course: <BookOpen className="w-4 h-4" />,
  module: <Hash className="w-4 h-4" />,
  community: <Users className="w-4 h-4" />,
};

export function ChatSidebar({
  selectedRoomId,
  onSelectRoom,
  onCreateRoom,
}: ChatSidebarProps) {
  const roomsQuery = trpc.chat.getMyRooms.useQuery();
  const rooms = roomsQuery.data ?? [];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-900 dark:text-white">Messages</h2>
        {onCreateRoom && (
          <button
            onClick={onCreateRoom}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="New conversation"
          >
            <Plus className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Room list */}
      <div className="flex-1 overflow-y-auto">
        {roomsQuery.isLoading ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            Loading conversations...
          </div>
        ) : rooms.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">
            No conversations yet
          </div>
        ) : (
          rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room.id, room.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                selectedRoomId === room.id
                  ? "bg-violet-50 dark:bg-violet-950/30 border-l-2 border-violet-600"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800 border-l-2 border-transparent"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  selectedRoomId === room.id
                    ? "bg-violet-100 dark:bg-violet-900/50 text-violet-600"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                }`}
              >
                {roomTypeIcons[room.type] ?? <Hash className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                  {room.name}
                </p>
                <p className="text-xs text-gray-400 capitalize">{room.type}</p>
              </div>

              {room.unreadCount > 0 && (
                <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-violet-600 rounded-full">
                  {room.unreadCount > 99 ? "99+" : room.unreadCount}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
