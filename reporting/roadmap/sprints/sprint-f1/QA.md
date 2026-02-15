# Sprint F1 — Quality Assurance Checklist

## Pre-Merge Verification

### Syntax & Build
| Check | Status |
|-------|--------|
| All 10 modified files pass `node -e readFileSync` | PASS |
| No TypeScript import errors | PASS |
| All `t()` keys exist in both EN and FR sections | PASS |
| No hardcoded English strings in user-facing UI | PASS |

### Bilingual Coverage (9 pages)
| Page | `useLanguage` imported | `t()` calls | `isFr` ternaries | Status |
|------|----------------------|-------------|-------------------|--------|
| Flashcards | Yes | 15+ | 5+ | PASS |
| DailyReview | Yes | 10+ | 3+ | PASS |
| Vocabulary | Yes | 12+ | 5+ | PASS |
| GrammarDrills | Yes | 20+ | 8+ | PASS |
| ReadingLab | Yes | 15+ | 6+ | PASS |
| WritingPortfolio | Yes | 12+ | 10+ | PASS |
| ListeningLab | Yes | 15+ | 10+ | PASS |
| WeeklyChallenges | Yes | 8+ | 12+ | PASS |
| StudyGroups | Yes | 6+ | 15+ | PASS |

### Accessibility Audit
| Criterion | Pages Passing | Status |
|-----------|---------------|--------|
| `role="main"` on content | 9/9 | PASS |
| `aria-hidden="true"` on icons | 9/9 | PASS |
| `focus:ring-2` on buttons | 9/9 | PASS |
| `role="status"` on loading | 9/9 | PASS |
| `sr-only` loading text | 9/9 | PASS |
| `role="list"` on card grids | 9/9 | PASS |
| `aria-label` on icon buttons | 9/9 | PASS |
| No emoji in empty states | 9/9 | PASS |

### Regression Checks
| Area | Status |
|------|--------|
| tRPC endpoint calls unchanged | PASS |
| Backend routers untouched | PASS |
| Existing state management preserved | PASS |
| Toast notifications functional | PASS |
| Navigation/routing unchanged | PASS |

## Post-Merge Smoke Test Plan
1. Switch language to FR — verify all 9 pages render in French
2. Switch language to EN — verify all 9 pages render in English
3. Tab through each page — verify all elements are focusable
4. Test with screen reader (VoiceOver/NVDA) — verify announcements
5. Verify empty states render with gradient icon boxes
6. Verify loading states show spinner with sr-only text
