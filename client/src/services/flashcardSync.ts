/**
 * Phase 5: Flashcard Sync Manager
 * Handles online/offline sync for flashcard data
 */
import {
  getPendingChanges,
  markAsSynced,
  saveFlashcards,
  saveDecks,
  setLastSyncTime,
  getLastSyncTime,
  type FlashcardData,
  type DeckData,
} from "./flashcardStorage";

export type SyncStatus = "idle" | "syncing" | "error" | "offline";

interface SyncState {
  status: SyncStatus;
  lastSync: string | null;
  pendingCount: number;
  error: string | null;
}

type SyncListener = (state: SyncState) => void;

class FlashcardSyncManager {
  private state: SyncState = {
    status: "idle",
    lastSync: null,
    pendingCount: 0,
    error: null,
  };
  private listeners: Set<SyncListener> = new Set();
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    // Listen for online/offline events
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.sync(); // Auto-sync when coming back online
    });
    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.updateState({ status: "offline" });
    });
  }

  /**
   * Subscribe to sync state changes
   */
  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.state); // Emit current state
    return () => this.listeners.delete(listener);
  }

  /**
   * Start periodic sync (every 30 seconds when online)
   */
  startPeriodicSync(intervalMs: number = 30000): void {
    this.stopPeriodicSync();
    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.state.status !== "syncing") {
        this.sync();
      }
    }, intervalMs);
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Perform a full sync cycle
   */
  async sync(): Promise<boolean> {
    if (!this.isOnline) {
      this.updateState({ status: "offline" });
      return false;
    }

    if (this.state.status === "syncing") return false;

    this.updateState({ status: "syncing", error: null });

    try {
      // Step 1: Push pending changes to server
      const pending = await getPendingChanges();
      
      if (pending.cards.length > 0 || pending.reviews.length > 0) {
        const pushResponse = await fetch("/api/flashcards/sync/push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            cards: pending.cards,
            reviews: pending.reviews,
          }),
        });

        if (pushResponse.ok) {
          const result = await pushResponse.json() as any;
          await markAsSynced(
            result.syncedCardIds || pending.cards.map((c: FlashcardData) => c.id),
            result.syncedReviewIds || pending.reviews.filter((r) => r.id).map((r) => r.id!)
          );
        }
      }

      // Step 2: Pull latest data from server
      const lastSync = await getLastSyncTime();
      const pullUrl = lastSync
        ? `/api/flashcards/sync/pull?since=${encodeURIComponent(lastSync)}`
        : "/api/flashcards/sync/pull";

      const pullResponse = await fetch(pullUrl, {
        credentials: "include",
      });

      if (pullResponse.ok) {
        const serverData = await pullResponse.json() as any;
        if (serverData.cards?.length > 0) {
          await saveFlashcards(serverData.cards);
        }
        if (serverData.decks?.length > 0) {
          await saveDecks(serverData.decks);
        }
      }

      // Step 3: Update sync timestamp
      const now = new Date().toISOString();
      await setLastSyncTime(now);

      this.updateState({
        status: "idle",
        lastSync: now,
        pendingCount: 0,
        error: null,
      });

      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Sync failed";
      console.error("[FlashcardSync] Error:", errorMsg);
      this.updateState({
        status: "error",
        error: errorMsg,
      });
      return false;
    }
  }

  /**
   * Get current sync state
   */
  getState(): SyncState {
    return { ...this.state };
  }

  private updateState(partial: Partial<SyncState>): void {
    this.state = { ...this.state, ...partial };
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

// Singleton instance
export const flashcardSync = new FlashcardSyncManager();
