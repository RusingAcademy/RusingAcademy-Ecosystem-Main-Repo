import { useState } from "react";
import { trpc } from "../lib/trpc";

interface LearnerNotesProps {
  lessonId: number;
  courseId: number;
}

export function LearnerNotes({ lessonId, courseId }: LearnerNotesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  
  const utils = trpc.useUtils();
  
  // Note: These would need corresponding backend endpoints
  // For now, we'll use local state as a placeholder
  const [notes, setNotes] = useState<Array<{
    id: number;
    content: string;
    isPinned: boolean;
    createdAt: Date;
  }>>([]);
  
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note = {
      id: Date.now(),
      content: newNote,
      isPinned: false,
      createdAt: new Date(),
    };
    
    setNotes([note, ...notes]);
    setNewNote("");
  };
  
  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };
  
  const handleTogglePin = (id: number) => {
    setNotes(notes.map(n => 
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    ));
  };
  
  const handleSaveEdit = (id: number) => {
    setNotes(notes.map(n => 
      n.id === id ? { ...n, content: editContent } : n
    ));
    setEditingId(null);
    setEditContent("");
  };
  
  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <span className="font-medium text-gray-900">My Notes</span>
          {notes.length > 0 && (
            <span className="bg-teal-100 text-teal-700 text-xs px-2 py-0.5 rounded-full">
              {notes.length}
            </span>
          )}
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Content */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          {/* Add Note Form */}
          <div className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note about this lesson..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
          
          {/* Notes List */}
          {sortedNotes.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p className="text-3xl mb-2">📒</p>
              <p>No notes yet. Add your first note above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedNotes.map((note) => (
                <div 
                  key={note.id}
                  className={`p-3 rounded-lg border ${
                    note.isPinned 
                      ? "bg-yellow-50 border-yellow-200" 
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {editingId === note.id ? (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(note.id)}
                          className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-gray-700 whitespace-pre-wrap flex-1">{note.content}</p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleTogglePin(note.id)}
                            className={`p-1 rounded hover:bg-white/50 ${
                              note.isPinned ? "text-yellow-600" : "text-gray-400"
                            }`}
                            title={note.isPinned ? "Unpin" : "Pin"}
                          >
                            📌
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(note.id);
                              setEditContent(note.content);
                            }}
                            className="p-1 rounded hover:bg-white/50 text-gray-400 hover:text-gray-600"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1 rounded hover:bg-white/50 text-gray-400 hover:text-red-500"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString()}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LearnerNotes;
