/**
 * ============================================
 * DEVELOPER DOCUMENTATION COMPONENT
 * ============================================
 * Month 6 — Polish, Scale & Launch
 * 
 * Setup instructions, coding standards,
 * Git workflow, and deployment documentation.
 */
import React, { useState } from "react";
import { useLocale } from "@/i18n/LocaleContext";

/* ── Types ── */
interface DocSection {
  id: string;
  title: string;
  titleFr: string;
  icon: string;
  content: string;
  contentFr: string;
}

/* ── Documentation Sections ── */
const DOC_SECTIONS: DocSection[] = [
  {
    id: "setup",
    title: "Project Setup",
    titleFr: "Configuration du projet",
    icon: "🛠️",
    content: `## Prerequisites
- Node.js 22.x (LTS)
- pnpm or npm
- Git

## Quick Start
\`\`\`bash
# Clone the repository
git clone https://github.com/RusingAcademy/RusingAcademy-Ecosystem-Main-Repo.git
cd rusingacademy

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build
\`\`\`

## Environment Variables
Create a \`.env\` file in the root directory:
\`\`\`
DATABASE_URL=your_tidb_connection_string
SESSION_SECRET=your_session_secret
\`\`\`

## Stack Overview
| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| tRPC | Type-safe API |
| TiDB | Database |
| Tailwind CSS | Styling |
| Railway | Deployment |`,
    contentFr: `## Prérequis
- Node.js 22.x (LTS)
- pnpm ou npm
- Git

## Démarrage rapide
\`\`\`bash
# Cloner le dépôt
git clone https://github.com/RusingAcademy/RusingAcademy-Ecosystem-Main-Repo.git
cd rusingacademy

# Installer les dépendances
npm install --legacy-peer-deps

# Démarrer le serveur de développement
npm run dev

# Compiler pour la production
npm run build
\`\`\`

## Variables d'environnement
Créer un fichier \`.env\` à la racine du projet :
\`\`\`
DATABASE_URL=votre_chaîne_de_connexion_tidb
SESSION_SECRET=votre_secret_de_session
\`\`\`

## Aperçu de la pile technologique
| Technologie | Objectif |
|------------|----------|
| React 18 | Framework UI |
| TypeScript | Sécurité des types |
| tRPC | API typée |
| TiDB | Base de données |
| Tailwind CSS | Styles |
| Railway | Déploiement |`,
  },
  {
    id: "coding-standards",
    title: "Coding Standards",
    titleFr: "Normes de codage",
    icon: "📏",
    content: `## TypeScript Standards
- Strict mode enabled
- No \`any\` types — use proper typing
- Prefer interfaces over type aliases for object shapes
- Use \`const\` assertions where applicable

## Component Standards
- Functional components with hooks only
- Named exports (no default exports for components)
- Props interface defined above component
- Bilingual labels object inside each component

## File Naming
- Components: PascalCase (\`DarkModeToggle.tsx\`)
- Utilities: camelCase (\`formatUtils.ts\`)
- Constants: UPPER_SNAKE_CASE
- CSS files: kebab-case (\`dark-mode.css\`)

## CSS / Styling
- Use design tokens (CSS custom properties) — never hardcode colors
- Dark mode: use \`dark:\` prefix or \`var(--dark-*)\` tokens
- Responsive: mobile-first approach
- Glassmorphism: use predefined \`.glass-*\` classes

## Accessibility (WCAG AA)
- All interactive elements must be keyboard accessible
- Color contrast ratio ≥ 4.5:1 for normal text
- Meaningful alt text on all images
- ARIA labels on custom interactive components
- Focus indicators on all focusable elements

## Bilingual (EN/FR)
- Every user-facing string must have EN and FR versions
- Use \`useLocale()\` hook to access current locale
- Canadian date format: YYYY-MM-DD
- French text is 20-30% longer — design for expansion`,
    contentFr: `## Normes TypeScript
- Mode strict activé
- Pas de types \`any\` — utiliser un typage approprié
- Préférer les interfaces aux alias de type pour les formes d'objet
- Utiliser les assertions \`const\` lorsque applicable

## Normes des composants
- Composants fonctionnels avec hooks uniquement
- Exports nommés (pas d'exports par défaut pour les composants)
- Interface Props définie au-dessus du composant
- Objet d'étiquettes bilingues dans chaque composant

## Nommage des fichiers
- Composants : PascalCase (\`DarkModeToggle.tsx\`)
- Utilitaires : camelCase (\`formatUtils.ts\`)
- Constantes : UPPER_SNAKE_CASE
- Fichiers CSS : kebab-case (\`dark-mode.css\`)

## CSS / Styles
- Utiliser les jetons de design (propriétés CSS personnalisées) — ne jamais coder en dur les couleurs
- Mode sombre : utiliser le préfixe \`dark:\` ou les jetons \`var(--dark-*)\`
- Réactif : approche mobile-first
- Glassmorphisme : utiliser les classes prédéfinies \`.glass-*\`

## Accessibilité (WCAG AA)
- Tous les éléments interactifs doivent être accessibles au clavier
- Ratio de contraste des couleurs ≥ 4,5:1 pour le texte normal
- Texte alternatif significatif sur toutes les images
- Étiquettes ARIA sur les composants interactifs personnalisés
- Indicateurs de focus sur tous les éléments focalisables

## Bilingue (EN/FR)
- Chaque chaîne visible par l'utilisateur doit avoir des versions EN et FR
- Utiliser le hook \`useLocale()\` pour accéder à la locale actuelle
- Format de date canadien : AAAA-MM-JJ
- Le texte français est 20-30% plus long — concevoir pour l'expansion`,
  },
  {
    id: "git-workflow",
    title: "Git Workflow",
    titleFr: "Flux de travail Git",
    icon: "🔀",
    content: `## Branch Strategy
| Branch | Purpose |
|--------|---------|
| \`main\` | Production-ready code |
| \`staging\` | Pre-production validation |
| \`feature/*\` | New features |
| \`fix/*\` | Bug fixes |
| \`hotfix/*\` | Critical production fixes |

## Workflow
1. Create feature branch from \`main\`
2. Implement changes with atomic commits
3. Open Pull Request to \`staging\`
4. Deploy to Railway staging environment
5. Visual validation and smoke tests
6. Merge to \`main\` after approval
7. Railway auto-deploys to production

## Commit Convention
\`\`\`
type(scope): description

feat(darkmode): add premium glassmorphism effects
fix(i18n): correct French date formatting
docs(styleguide): add color token documentation
perf(fonts): optimize French diacritic loading
test(qa): add visual regression utilities
\`\`\`

## Golden Rules
- Never push directly to \`main\`
- Always validate on staging first
- Immutable core components: Header, Hero, Widget
- Zero visual regression on existing components`,
    contentFr: `## Stratégie de branches
| Branche | Objectif |
|---------|----------|
| \`main\` | Code prêt pour la production |
| \`staging\` | Validation pré-production |
| \`feature/*\` | Nouvelles fonctionnalités |
| \`fix/*\` | Corrections de bogues |
| \`hotfix/*\` | Corrections critiques en production |

## Flux de travail
1. Créer une branche feature depuis \`main\`
2. Implémenter les changements avec des commits atomiques
3. Ouvrir une Pull Request vers \`staging\`
4. Déployer sur l'environnement staging Railway
5. Validation visuelle et tests de fumée
6. Fusionner vers \`main\` après approbation
7. Railway déploie automatiquement en production

## Convention de commits
\`\`\`
type(portée): description

feat(modesombre): ajouter effets glassmorphisme premium
fix(i18n): corriger le formatage des dates en français
docs(guidestyle): ajouter documentation des jetons de couleur
perf(polices): optimiser le chargement des diacritiques français
test(qa): ajouter utilitaires de régression visuelle
\`\`\`

## Règles d'or
- Ne jamais pousser directement vers \`main\`
- Toujours valider sur staging d'abord
- Composants principaux immuables : En-tête, Hero, Widget
- Zéro régression visuelle sur les composants existants`,
  },
  {
    id: "deployment",
    title: "Deployment",
    titleFr: "Déploiement",
    icon: "🚀",
    content: `## Railway Deployment
The project is deployed on Railway with automatic deployments from the \`main\` branch.

## Deployment Checklist
- [ ] All tests pass locally
- [ ] Build succeeds: \`npm run build\`
- [ ] No TypeScript errors
- [ ] Visual regression tests pass
- [ ] Staging validation complete
- [ ] Core Web Vitals within thresholds
- [ ] Both EN and FR content verified
- [ ] Dark mode tested
- [ ] Mobile responsiveness verified
- [ ] WCAG AA compliance confirmed

## Production Smoke Test
After each deployment, verify:
1. Homepage loads (HTTP 200)
2. Header and Widget display correctly
3. Brand Hub Cards render properly
4. CTAs are functional
5. Language switch works
6. Login route is functional
7. Mobile display is correct
8. Zero critical console errors

## Rollback Procedure
\`\`\`bash
# Identify the last stable commit
git log --oneline -10

# Revert to stable commit
git revert HEAD
git push origin main
\`\`\``,
    contentFr: `## Déploiement Railway
Le projet est déployé sur Railway avec des déploiements automatiques depuis la branche \`main\`.

## Liste de contrôle de déploiement
- [ ] Tous les tests passent localement
- [ ] La compilation réussit : \`npm run build\`
- [ ] Pas d'erreurs TypeScript
- [ ] Les tests de régression visuelle passent
- [ ] La validation staging est complète
- [ ] Les Core Web Vitals sont dans les seuils
- [ ] Le contenu EN et FR est vérifié
- [ ] Le mode sombre est testé
- [ ] La réactivité mobile est vérifiée
- [ ] La conformité WCAG AA est confirmée

## Test de fumée en production
Après chaque déploiement, vérifier :
1. La page d'accueil se charge (HTTP 200)
2. L'en-tête et le Widget s'affichent correctement
3. Les cartes Brand Hub s'affichent correctement
4. Les CTA sont fonctionnels
5. Le changement de langue fonctionne
6. La route de connexion est fonctionnelle
7. L'affichage mobile est correct
8. Zéro erreur critique dans la console

## Procédure de restauration
\`\`\`bash
# Identifier le dernier commit stable
git log --oneline -10

# Revenir au commit stable
git revert HEAD
git push origin main
\`\`\``,
  },
];

/* ── DeveloperDocs Component ── */
interface DeveloperDocsProps {
  className?: string;
}

export function DeveloperDocs({ className = "" }: DeveloperDocsProps) {
  const { locale } = useLocale();
  const [activeSection, setActiveSection] = useState(DOC_SECTIONS[0].id);

  const labels = {
    en: {
      title: "Developer Documentation",
      subtitle: "Setup, coding standards, Git workflow, and deployment guide",
    },
    fr: {
      title: "Documentation développeur",
      subtitle: "Configuration, normes de codage, flux Git et guide de déploiement",
    },
  };
  const t = labels[locale];

  const activeDoc = DOC_SECTIONS.find((s) => s.id === activeSection);

  return (
    <section
      className={`rounded-2xl border border-[var(--border-color-light)] bg-[var(--bg-elevated)] p-6 shadow-sm dark:border-[rgba(255,255,255,0.1)] dark:bg-[var(--dark-bg-elevated)] ${className}`}
      aria-label={t.title}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
          {t.title}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)] dark:text-[var(--dark-text-muted)]">
          {t.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Navigation */}
        <nav className="shrink-0 lg:w-56">
          <ul className="space-y-1">
            {DOC_SECTIONS.map((sec) => (
              <li key={sec.id}>
                <button
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    activeSection === sec.id
                      ? "bg-[var(--brand-foundation-soft)] text-[var(--brand-foundation)] dark:bg-[var(--dark-brand-foundation-soft)] dark:text-[var(--dark-brand-foundation-2)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--section-bg-2)] dark:text-[var(--dark-text-secondary)] dark:hover:bg-[var(--dark-section-bg-2)]"
                  }`}
                  aria-current={activeSection === sec.id ? "page" : undefined}
                >
                  <span>{sec.icon}</span>
                  <span>{locale === "fr" ? sec.titleFr : sec.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeDoc && (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div
                className="rounded-xl border border-[var(--border-color-light)] bg-[var(--bg-base)] p-6 dark:border-[rgba(255,255,255,0.08)] dark:bg-[var(--dark-bg-base)]"
                style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font-ui)" }}
              >
                <h3 className="mb-4 text-lg font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                  {activeDoc.icon} {locale === "fr" ? activeDoc.titleFr : activeDoc.title}
                </h3>
                <div className="text-sm leading-relaxed text-[var(--text-secondary)] dark:text-[var(--dark-text-secondary)]">
                  {(locale === "fr" ? activeDoc.contentFr : activeDoc.content)
                    .split("\n")
                    .map((line, i) => {
                      if (line.startsWith("## "))
                        return (
                          <h4 key={i} className="mb-2 mt-6 text-base font-bold text-[var(--text-primary)] dark:text-[var(--dark-text-primary)]">
                            {line.replace("## ", "")}
                          </h4>
                        );
                      if (line.startsWith("- "))
                        return (
                          <div key={i} className="ml-4 flex gap-2">
                            <span>•</span>
                            <span>{line.replace("- ", "")}</span>
                          </div>
                        );
                      if (line.startsWith("```"))
                        return (
                          <div key={i} className="my-1 rounded bg-[var(--section-bg-2)] px-1 font-mono text-xs dark:bg-[var(--dark-section-bg-2)]">
                            {line.replace(/```\w*/, "")}
                          </div>
                        );
                      if (line.startsWith("| "))
                        return (
                          <div key={i} className="font-mono text-xs">
                            {line}
                          </div>
                        );
                      return line.trim() ? <p key={i} className="mb-2">{line}</p> : <br key={i} />;
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DeveloperDocs;
