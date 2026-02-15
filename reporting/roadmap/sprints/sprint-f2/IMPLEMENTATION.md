# Sprint F2 — Implementation Details

## Backend: Study Streaks

### Table Schema
```sql
CREATE TABLE IF NOT EXISTS study_streaks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  studyDate DATE NOT NULL,
  cardsReviewed INT DEFAULT 0,
  correctCount INT DEFAULT 0,
  sessionDurationSec INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_date (userId, studyDate),
  INDEX idx_ss_user (userId)
)
```

### Streak Calculation Algorithm
The `getStreak` endpoint:
1. Fetches last 90 study dates for the user, ordered descending
2. Walks backward from today: if each consecutive day has a record, increments `currentStreak`
3. Scans all dates to find `longestStreak` using a sliding window
4. Computes `accuracy` as `totalCorrect / totalCards * 100`
5. Returns `recentDays` (last 30 entries) for potential heatmap display

### Session Recording
The `recordSession` mutation uses `ON DUPLICATE KEY UPDATE` to aggregate multiple sessions on the same day:
```sql
INSERT INTO study_streaks (userId, studyDate, cardsReviewed, correctCount, sessionDurationSec)
VALUES (?, CURDATE(), ?, ?, ?)
ON DUPLICATE KEY UPDATE
  cardsReviewed = cardsReviewed + VALUES(cardsReviewed),
  correctCount = correctCount + VALUES(correctCount),
  sessionDurationSec = sessionDurationSec + VALUES(sessionDurationSec)
```

## Frontend: Flashcards

### New ViewMode: "summary"
Added a fourth view mode (`"decks" | "cards" | "review" | "summary"`) that displays after completing a review session.

### Session State
```tsx
const [sessionCorrect, setSessionCorrect] = useState(0);
const [sessionTotal, setSessionTotal] = useState(0);
const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
const [sessionElapsed, setSessionElapsed] = useState(0);
```

### Keyboard Shortcuts
```tsx
useEffect(() => {
  if (viewMode !== "review" || reviewComplete) return;
  function handleKeyDown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); setIsFlipped(prev => !prev); }
    else if (isFlipped) {
      if (e.key === "1") handleReview(1);      // Again
      else if (e.key === "2") handleReview(3);  // Hard
      else if (e.key === "3") handleReview(4);  // Good
      else if (e.key === "4") handleReview(5);  // Easy
    }
  }
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [viewMode, reviewComplete, isFlipped, handleReview]);
```

### Stats Bar Enhancement
Extended from 4 stats to 6 stats: Total Decks, Total Cards, Due Today, Mastered, Day Streak, Accuracy.

## Frontend: Vocabulary

### Mastery Progress Bar
Each word card now displays a horizontal progress bar showing the correct/review ratio:
- Color matches the mastery level (blue for new, amber for learning, etc.)
- Animated width transition for smooth visual feedback
- ARIA progressbar role with valuenow/min/max

## Backward Compatibility
- Zero breaking changes to existing endpoints
- New endpoints are additive only
- `study_streaks` table is created on-the-fly
- All existing functionality preserved
