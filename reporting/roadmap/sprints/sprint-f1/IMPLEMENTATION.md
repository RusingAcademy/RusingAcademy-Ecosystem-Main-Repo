# Sprint F1 — Implementation Details

## Architecture Decisions

### Bilingual Strategy
All pages now follow a consistent pattern:
```tsx
const { t, language } = useLanguage();
const isFr = language === "fr";
```

- **Static labels**: Use `t("key")` from LanguageContext
- **Dynamic text** (toasts, conditional messages): Use `isFr ? "French" : "English"` ternary
- **Date formatting**: `toLocaleDateString(isFr ? "fr-CA" : "en-CA")`
- **Bilingual content fields**: Display `titleFr`/`title` based on `isFr`

### i18n Key Naming Convention
```
{domain}.{element}
```
Examples: `flashcards.title`, `grammar.chooseLevel`, `writing.emptyTitle`

Shared keys use `skillLabs.*` prefix: `skillLabs.loading`, `skillLabs.noData`

### Accessibility Pattern
Every page follows this WCAG 2.1 AA checklist:
1. `role="main"` on primary content container
2. `role="status"` on loading/empty states with `sr-only` text
3. `role="list"` / `role="listitem"` on card grids
4. `role="radiogroup"` / `role="radio"` on level selectors
5. `aria-label` on all buttons without visible text
6. `aria-hidden="true"` on all decorative Material Icons
7. `focus:outline-none focus:ring-2 focus:ring-[#008090]/30` on all interactive elements
8. `aria-expanded` on toggle buttons
9. `role="progressbar"` with `aria-valuenow/min/max` on progress bars
10. `role="meter"` on score displays

### Empty State Design System
All empty states follow a consistent visual pattern:
```tsx
<div className="text-center py-12" role="status">
  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-{color}-50 to-{color}-50 flex items-center justify-center">
    <span className="material-icons text-4xl text-{color}/60" aria-hidden="true">{icon}</span>
  </div>
  <h3 className="text-lg font-semibold text-gray-700 mb-2">{t("domain.emptyTitle")}</h3>
  <p className="text-sm text-gray-500 max-w-sm mx-auto">{t("domain.emptyDesc")}</p>
</div>
```

## Files Modified

### LanguageContext.tsx
- Added 65+ English keys under `skillLabs.*`, `flashcards.*`, `vocabulary.*`, `grammar.*`, `reading.*`, `writing.*`, `listening.*`, `challenges.*`, `studyGroups.*`, `dailyReview.*`
- Added matching 65+ French keys

### 9 Skill Lab Pages
Each page received:
- Full `t()` integration for all user-visible strings
- ARIA roles and labels on all interactive elements
- Professional empty states with gradient icon boxes
- Bilingual toast messages
- Locale-aware date formatting
- Focus ring styling on all buttons and inputs
- Screen reader support for loading states

## Backward Compatibility
- Zero breaking changes to tRPC endpoints
- Zero changes to backend routers
- All existing functionality preserved
- Pages that were already using `useLanguage` now actually use `t()`
