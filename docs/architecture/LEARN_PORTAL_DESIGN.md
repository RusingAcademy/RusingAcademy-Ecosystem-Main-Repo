# LearnLayout Design Reference (from UX Blueprint)

## Course Portal Layout
- Left sidebar: Modules/Lessons tree + Progress bar + Notes quick access + Bookmarks
- Main content: Video/Text/AI Practice + Transcript + Resources + Quiz
- AI Companion panel (right, collapsible): Practice speaking, Vocabulary review, Pronunciation feedback, Exam simulation
- Bottom control bar: ← Previous lesson | Mark complete | Next →

## Key UX Principles
- Ultra focus learning — learner must "forget the platform"
- Auto-save progression
- Resume automatique (pick up where left off)
- Next lesson obvious
- Timer for oral AI sessions
- Autoplay next lesson option
- Playback speed memory
- Quick vocabulary save

## Visual Rules
- Minimal: no analytics visible, no marketing distractions, no excessive menus
- 18px body text for learner portal
- High contrast WCAG AA minimum
- Keyboard navigation
- ARIA labels
- Generous padding (24px sections)
- Max content width ~1280px

## Bottom Nav Pattern
```
← Previous lesson    Mark complete    Next →
```

## Sidebar Course Pattern
```
Module 1 — Introduction
  ✅ Lesson 1: Welcome (3m)
  ▶ Lesson 2: Getting Started (8m)  ← current
  ○ Lesson 3: First Practice (12m)
  🔒 Lesson 4: Advanced (15m)

Module 2 — Core Skills
  ○ Lesson 5: Vocabulary (10m)
  ○ Lesson 6: Grammar (14m)
```
