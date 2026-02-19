/**
 * Phase 5: Offline Flashcard Storage (IndexedDB)
 * Provides offline-first flashcard storage with sync capabilities
 */

const DB_NAME = "rusingacademy-flashcards";
const DB_VERSION = 1;

export interface FlashcardData {
  id: number;
  front: string;
  back: string;
  deckId: number;
  nextReview: string;
  interval: number;
  easeFactor: number;
  syncStatus: "synced" | "pending" | "conflict";
  updatedAt: string;
}

export interface DeckData {
  id: number;
  name: string;
  description: string;
  cardCount: number;
  syncStatus: "synced" | "pending";
  updatedAt: string;
}

export interface ReviewData {
  id?: number;
  cardId: number;
  rating: number;
  responseTime: number;
  reviewedAt: string;
  syncStatus: "synced" | "pending";
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Flashcards store
      if (!db.objectStoreNames.contains("flashcards")) {
        const flashcardsStore = db.createObjectStore("flashcards", { keyPath: "id" });
        flashcardsStore.createIndex("by-deck", "deckId", { unique: false });
        flashcardsStore.createIndex("by-next-review", "nextReview", { unique: false });
        flashcardsStore.createIndex("by-sync-status", "syncStatus", { unique: false });
      }

      // Decks store
      if (!db.objectStoreNames.contains("decks")) {
        db.createObjectStore("decks", { keyPath: "id" });
      }

      // Review history store
      if (!db.objectStoreNames.contains("reviewHistory")) {
        const reviewStore = db.createObjectStore("reviewHistory", { keyPath: "id", autoIncrement: true });
        reviewStore.createIndex("by-card", "cardId", { unique: false });
        reviewStore.createIndex("by-sync-status", "syncStatus", { unique: false });
      }

      // Sync metadata store
      if (!db.objectStoreNames.contains("syncMeta")) {
        db.createObjectStore("syncMeta", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ============ Flashcards CRUD ============

export async function saveFlashcards(cards: FlashcardData[]): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction("flashcards", "readwrite");
  const store = tx.objectStore("flashcards");
  for (const card of cards) {
    store.put(card);
  }
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFlashcardsByDeck(deckId: number): Promise<FlashcardData[]> {
  const db = await openDatabase();
  const tx = db.transaction("flashcards", "readonly");
  const store = tx.objectStore("flashcards");
  const index = store.index("by-deck");
  const request = index.getAll(deckId);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getDueFlashcards(deckId?: number): Promise<FlashcardData[]> {
  const db = await openDatabase();
  const tx = db.transaction("flashcards", "readonly");
  const store = tx.objectStore("flashcards");
  const now = new Date().toISOString();

  return new Promise((resolve, reject) => {
    const results: FlashcardData[] = [];
    const request = store.openCursor();
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        const card = cursor.value as FlashcardData;
        if (card.nextReview <= now && (!deckId || card.deckId === deckId)) {
          results.push(card);
        }
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

export async function updateFlashcardReview(
  cardId: number,
  rating: number,
  responseTime: number
): Promise<FlashcardData | null> {
  const db = await openDatabase();
  
  // Get current card
  const getTx = db.transaction("flashcards", "readonly");
  const card = await new Promise<FlashcardData | undefined>((resolve, reject) => {
    const req = getTx.objectStore("flashcards").get(cardId);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  if (!card) return null;

  // SM-2 algorithm
  let { interval, easeFactor } = card;
  if (rating >= 3) {
    if (interval === 0) interval = 1;
    else if (interval === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)));
  } else {
    interval = 0;
    // Don't change easeFactor on failure
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  const updatedCard: FlashcardData = {
    ...card,
    interval,
    easeFactor,
    nextReview: nextReview.toISOString(),
    syncStatus: "pending",
    updatedAt: new Date().toISOString(),
  };

  // Save updated card
  const putTx = db.transaction("flashcards", "readwrite");
  putTx.objectStore("flashcards").put(updatedCard);

  // Save review history
  const reviewTx = db.transaction("reviewHistory", "readwrite");
  reviewTx.objectStore("reviewHistory").add({
    cardId,
    rating,
    responseTime,
    reviewedAt: new Date().toISOString(),
    syncStatus: "pending",
  } as ReviewData);

  return updatedCard;
}

// ============ Decks CRUD ============

export async function saveDecks(decks: DeckData[]): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction("decks", "readwrite");
  const store = tx.objectStore("decks");
  for (const deck of decks) {
    store.put(deck);
  }
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllDecks(): Promise<DeckData[]> {
  const db = await openDatabase();
  const tx = db.transaction("decks", "readonly");
  const request = tx.objectStore("decks").getAll();
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ============ Sync ============

export async function getPendingChanges(): Promise<{
  cards: FlashcardData[];
  reviews: ReviewData[];
}> {
  const db = await openDatabase();

  const cardsTx = db.transaction("flashcards", "readonly");
  const cardsIndex = cardsTx.objectStore("flashcards").index("by-sync-status");
  const pendingCards = await new Promise<FlashcardData[]>((resolve, reject) => {
    const req = cardsIndex.getAll("pending");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  const reviewsTx = db.transaction("reviewHistory", "readonly");
  const reviewsIndex = reviewsTx.objectStore("reviewHistory").index("by-sync-status");
  const pendingReviews = await new Promise<ReviewData[]>((resolve, reject) => {
    const req = reviewsIndex.getAll("pending");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return { cards: pendingCards, reviews: pendingReviews };
}

export async function markAsSynced(cardIds: number[], reviewIds: number[]): Promise<void> {
  const db = await openDatabase();

  if (cardIds.length > 0) {
    const tx = db.transaction("flashcards", "readwrite");
    const store = tx.objectStore("flashcards");
    for (const id of cardIds) {
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result) {
          store.put({ ...req.result, syncStatus: "synced" });
        }
      };
    }
  }

  if (reviewIds.length > 0) {
    const tx = db.transaction("reviewHistory", "readwrite");
    const store = tx.objectStore("reviewHistory");
    for (const id of reviewIds) {
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result) {
          store.put({ ...req.result, syncStatus: "synced" });
        }
      };
    }
  }
}

export async function getLastSyncTime(): Promise<string | null> {
  const db = await openDatabase();
  const tx = db.transaction("syncMeta", "readonly");
  const req = tx.objectStore("syncMeta").get("lastSync");
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result?.value || null);
    req.onerror = () => reject(req.error);
  });
}

export async function setLastSyncTime(time: string): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction("syncMeta", "readwrite");
  tx.objectStore("syncMeta").put({ key: "lastSync", value: time });
}

// ============ Stats ============

export async function getStorageStats(): Promise<{
  totalCards: number;
  totalDecks: number;
  pendingSync: number;
  lastSync: string | null;
}> {
  const db = await openDatabase();

  const cardCount = await new Promise<number>((resolve, reject) => {
    const req = db.transaction("flashcards", "readonly").objectStore("flashcards").count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  const deckCount = await new Promise<number>((resolve, reject) => {
    const req = db.transaction("decks", "readonly").objectStore("decks").count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  const pending = await getPendingChanges();
  const lastSync = await getLastSyncTime();

  return {
    totalCards: cardCount,
    totalDecks: deckCount,
    pendingSync: pending.cards.length + pending.reviews.length,
    lastSync,
  };
}

/**
 * Clear all offline data
 */
export async function clearAllData(): Promise<void> {
  const db = await openDatabase();
  const stores = ["flashcards", "decks", "reviewHistory", "syncMeta"];
  for (const storeName of stores) {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).clear();
  }
}
