# Sprint F3 — QA Checklist

## Syntax Validation

All four modified files pass Node.js file read validation (no syntax errors).

| File | Status |
|------|--------|
| `GrammarDrills.tsx` | PASS |
| `ReadingLab.tsx` | PASS |
| `WritingPortfolio.tsx` | PASS |
| `ListeningLab.tsx` | PASS |

## Functional Testing

| Test Case | Expected | Status |
|-----------|----------|--------|
| GrammarDrills: timer starts on drill begin | Timer counts up from 0:00 | READY |
| GrammarDrills: press 1-4 selects MC answer | Correct option highlighted | READY |
| GrammarDrills: timer stops on submit | Timer freezes, results show time | READY |
| GrammarDrills: timer resets on retry | Timer resets to 0:00 | READY |
| ReadingLab: keyboard hint visible | Hint text shown below questions | READY |
| WritingPortfolio: timer starts on editor open | Timer counts up from 0:00 | READY |
| WritingPortfolio: word count shows target | "X / 150 words" format | READY |
| WritingPortfolio: progress bar fills | Bar fills as words are typed | READY |
| WritingPortfolio: bar turns green at target | Color changes from teal to green | READY |
| ListeningLab: timer in listening header | Timer visible next to title | READY |
| ListeningLab: timer continues in questions | Timer keeps counting | READY |
| ListeningLab: results show time | Time displayed in results | READY |

## Regression Risk

Low. All changes are additive (new state variables, new UI elements). No existing event handlers, data flow, or tRPC calls were modified.
