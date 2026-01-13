# Bilingual Routing V2 - Technical Plan

## Overview
Re-implementation of bilingual routing with a robust, defensive architecture that cannot break the site render.

## Core Principle
**The routing bilingue ne doit JAMAIS pouvoir casser le rendu.**

---

## Architecture

### 1. Central Path Normalization (`normalizePath`)
Single source of truth for path parsing:

```typescript
// client/src/utils/pathNormalizer.ts
export interface NormalizedPath {
  lang: 'en' | 'fr';
  path: string;
}

export function normalizePath(rawPath: string): NormalizedPath {
  const match = rawPath.match(/^\/(en|fr)(\/.*)?$/);
  return {
    lang: match ? (match[1] as 'en' | 'fr') : 'en',
    path: match ? (match[2] || '/') : rawPath,
  };
}
```

### 2. No Global Blocking Redirects
- ❌ NO automatic redirect `/` → `/en/`
- ❌ NO redirect before render
- ✅ Silent fallback to default language
- ✅ Manual language selector
- ✅ SEO via `<link rel="alternate" hreflang>`

### 3. Defensive Fallbacks in EcosystemLayout
```typescript
function getBrandSafe(path: string): Brand {
  const { path: normalized } = normalizePath(path);
  
  if (normalized.startsWith('/lingueefy')) return 'lingueefy';
  if (normalized.startsWith('/rusingacademy')) return 'rusingacademy';
  if (normalized.startsWith('/barholex')) return 'barholex';
  
  return 'ecosystem'; // NEVER null/undefined
}

function getSubHeaderSafe(path: string): React.ReactNode {
  const { path: normalized } = normalizePath(path);
  
  if (normalized === '/' || normalized === '/ecosystem') return <HubSubHeader />;
  if (normalized.startsWith('/lingueefy')) return <LingueefySubHeader />;
  if (normalized.startsWith('/rusingacademy')) return <RusingAcademySubHeader />;
  if (normalized.startsWith('/barholex')) return <BarholexSubHeader />;
  
  return <HubSubHeader />; // Safe fallback - always render something
}
```

### 4. Language Context (No Redirects)
```typescript
// client/src/contexts/LanguageContext.tsx
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { lang } = normalizePath(location);
  
  // NO redirects - just provide the language
  return (
    <LanguageContext.Provider value={{ language: lang, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
```

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `client/src/utils/pathNormalizer.ts` | CREATE | Central path normalization utility |
| `client/src/components/EcosystemLayout.tsx` | MODIFY | Use `normalizePath`, add defensive fallbacks |
| `client/src/contexts/LanguageContext.tsx` | MODIFY | Use `normalizePath`, remove redirects |
| `client/src/components/EcosystemHeader.tsx` | MODIFY | Use normalized path for language display |
| `client/src/App.tsx` | MODIFY | Add language-prefixed routes (no redirects) |

---

## Routes to Add (App.tsx)

```typescript
// Public pages with language prefixes
<Route path="/" component={EcosystemLanding} />
<Route path="/en" component={EcosystemLanding} />
<Route path="/fr" component={EcosystemLanding} />
<Route path="/en/" component={EcosystemLanding} />
<Route path="/fr/" component={EcosystemLanding} />

<Route path="/lingueefy" component={LingueefyLanding} />
<Route path="/en/lingueefy" component={LingueefyLanding} />
<Route path="/fr/lingueefy" component={LingueefyLanding} />

<Route path="/rusingacademy" component={RusingAcademyLanding} />
<Route path="/en/rusingacademy" component={RusingAcademyLanding} />
<Route path="/fr/rusingacademy" component={RusingAcademyLanding} />
```

---

## Test Checklist (Before Merge)

| Route | Expected Result |
|-------|-----------------|
| `/` | ✅ Header + Main content + Footer |
| `/en` | ✅ Header + Main content + Footer |
| `/fr` | ✅ Header + Main content + Footer |
| `/lingueefy` | ✅ Lingueefy subheader + content |
| `/en/lingueefy` | ✅ Lingueefy subheader + content |
| `/fr/lingueefy` | ✅ Lingueefy subheader + content |
| `/rusingacademy` | ✅ RusingAcademy subheader + content |
| `/login` | ✅ No ecosystem header (excluded) |

**Validation criteria:**
- ✅ Header visible
- ✅ `<main>` not empty
- ✅ No redirect loops
- ✅ No blank pages

---

## SEO Implementation (Phase 2)

After routing is stable:
1. Add `<link rel="alternate" hreflang="en" href="/en/..." />`
2. Add `<link rel="alternate" hreflang="fr" href="/fr/..." />`
3. Generate `sitemap.xml` with both language versions
4. Add `robots.txt` with sitemap reference

---

## Rollback Plan

If any issue detected:
1. `git checkout main`
2. Delete feature branch if needed
3. Production remains on stable `main`

---

## Timeline

| Phase | Duration | Description |
|-------|----------|-------------|
| 1 | Done | Create feature branch |
| 2 | 30 min | Implement `pathNormalizer.ts` |
| 3 | 30 min | Update `EcosystemLayout.tsx` |
| 4 | 20 min | Update `App.tsx` routes |
| 5 | 20 min | Test all routes locally |
| 6 | - | Review and merge (requires approval) |
