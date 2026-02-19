/**
 * useProgressSync — Phase 2
 * React hook for real-time lesson progress sync with debouncing and offline queue
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { trpc } from "../lib/trpc";

interface ProgressUpdate {
  lessonId: number;
  courseId?: number;
  moduleId?: number;
  status: "not_started" | "in_progress" | "completed";
  progressPercent: number;
  timeSpentSeconds: number;
}

interface UseProgressSyncOptions {
  debounceMs?: number;
  autoSync?: boolean;
}

export function useProgressSync(options: UseProgressSyncOptions = {}) {
  const { debounceMs = 2000, autoSync = true } = options;

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pendingQueue = useRef<ProgressUpdate[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncMutation = trpc.progressSync.sync.useMutation();
  const batchSyncMutation = trpc.progressSync.batchSync.useMutation();

  /**
   * Queue a progress update with debouncing
   */
  const updateProgress = useCallback(
    (update: ProgressUpdate) => {
      // Replace existing entry for same lessonId or add new
      const existingIdx = pendingQueue.current.findIndex(
        (p) => p.lessonId === update.lessonId
      );
      if (existingIdx >= 0) {
        pendingQueue.current[existingIdx] = update;
      } else {
        pendingQueue.current.push(update);
      }

      setError(null);

      if (!autoSync) return;

      // Debounce the sync
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        flushQueue();
      }, debounceMs);
    },
    [autoSync, debounceMs]
  );

  /**
   * Immediately flush all pending updates to the server
   */
  const flushQueue = useCallback(async () => {
    if (pendingQueue.current.length === 0) return;
    if (isSyncing) return;

    const updates = [...pendingQueue.current];
    pendingQueue.current = [];

    setIsSyncing(true);
    setError(null);

    try {
      if (updates.length === 1) {
        await syncMutation.mutateAsync(updates[0]);
      } else {
        await batchSyncMutation.mutateAsync({ updates });
      }
      setLastSyncAt(new Date());
    } catch (err: any) {
      // Re-queue failed updates for retry
      pendingQueue.current = [...updates, ...pendingQueue.current];
      setError(err.message || "Sync failed");
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, syncMutation, batchSyncMutation]);

  /**
   * Mark a lesson as completed (convenience method)
   */
  const completeLesson = useCallback(
    (lessonId: number, courseId?: number, moduleId?: number, timeSpentSeconds = 0) => {
      updateProgress({
        lessonId,
        courseId,
        moduleId,
        status: "completed",
        progressPercent: 100,
        timeSpentSeconds,
      });
      // Immediately flush for completion events
      setTimeout(() => flushQueue(), 100);
    },
    [updateProgress, flushQueue]
  );

  // Flush on unmount to avoid losing data
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      // Sync remaining queue
      if (pendingQueue.current.length > 0) {
        const updates = [...pendingQueue.current];
        if (updates.length === 1) {
          syncMutation.mutate(updates[0]);
        } else {
          batchSyncMutation.mutate({ updates });
        }
      }
    };
  }, []);

  // Flush before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (pendingQueue.current.length > 0) {
        const updates = [...pendingQueue.current];
        // Use sendBeacon for reliability
        const data = JSON.stringify({ updates });
        navigator.sendBeacon?.("/api/progress/batch-sync", data);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return {
    updateProgress,
    completeLesson,
    flushQueue,
    isSyncing,
    lastSyncAt,
    error,
    pendingCount: pendingQueue.current.length,
  };
}
