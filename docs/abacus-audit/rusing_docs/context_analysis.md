# Analyse Contextuelle - Écosystème RusingÂcademy/Lingueefy
**Date:** 10 janvier 2026  
**Analyste:** Agent de diagnostic technique  
**Source:** Documents Google Drive du projet

---

## 📋 RÉSUMÉ EXÉCUTIF

L'écosystème RusingÂcademy est une plateforme éducative multi-marques destinée à la formation linguistique (SLE - Second Language Evaluation) des fonctionnaires canadiens. Le projet comprend trois marques principales :

1. **RusingÂcademy** (rusingacademy.ca) - Hub principal, curriculum structuré
2. **Lingueefy** (lingueefy.com/ca) - Plateforme de jumelage coach-apprenant avec IA
3. **Barholex Media** - Production média et coaching

---

## 🚨 PROBLÈMES TECHNIQUES IDENTIFIÉS

### 1. Configuration de Domaine (CRITIQUE)

**Fichier source:** `domain-config-findings.md`

#### Statut actuel de rusingacademy.ca
- ✅ **Nameservers changés** : Maintenant sur GoDaddy (ns37.domaincontrol.com, ns38.domaincontrol.com)
- ❌ **Anciennement sur Wix** : ns8.wixdns.net, ns9.wixdns.net (désormais déconnecté)
- ⚠️ **Non listé dans le panneau Wix** : Le domaine n'était pas correctement connecté à Wix

#### Domaines connectés à Wix
- **rusing.academy** - Domaine principal (Connected by Pointing)
- **barholex.com** - Redirige vers le principal
- **barholex.ca** - Redirige vers le principal

#### Configuration DNS actuelle dans GoDaddy
```
A record:    @ → Parked (DOIT être changé vers l'IP Manus)
NS:          ns37.domaincontrol.com, ns38.domaincontrol.com
CNAME:       www → rusingacademy.ca (DOIT pointer vers Manus CNAME)
CNAME:       _domainconnect → _domainconnect.gd.domaincontrol.com
```

#### Actions requises (PRIORITÉ HAUTE)
1. ✏️ Éditer l'enregistrement A pour pointer vers l'adresse IP Manus
2. ✏️ Éditer le CNAME www pour pointer vers le CNAME Manus
3. ⚙️ Configurer le domaine dans Manus Settings → Domains

---

## 🏗️ ARCHITECTURE TECHNIQUE

### Stack Technologique Complète

**Fichier source:** `package.json`

#### Frontend
- **Framework UI:** React 19.2.1 + React DOM 19.2.1
- **Routing:** Wouter 3.3.5 (patché)
- **State Management:** @tanstack/react-query 5.90.2
- **Styling:** 
  - TailwindCSS 4.1.14 (avec @tailwindcss/vite 4.1.3)
  - Framer Motion 12.23.22 (animations)
  - next-themes 0.4.6 (thèmes clair/sombre)
- **UI Components:** Radix UI (suite complète - 25+ composants)
- **Forms:** react-hook-form 7.64.0 + @hookform/resolvers 5.2.2
- **Validation:** Zod 4.1.12
- **Icons:** Lucide React 0.453.0
- **Charts:** Recharts 2.15.2
- **Carousel:** Embla Carousel React 8.6.0

#### Backend
- **Runtime:** Node.js avec Express 4.21.2
- **API:** tRPC 11.6.0 (client + server + react-query)
- **Base de données:** 
  - MySQL2 3.15.0
  - Drizzle ORM 0.44.5
  - Drizzle Kit 0.31.4
- **Authentification:** Jose 6.1.0 (JWT)
- **Stockage:** AWS S3 (@aws-sdk/client-s3 3.693.0)
- **Paiements:** Stripe 20.1.2

#### Build & Dev Tools
- **Bundler:** Vite 7.1.7 + @vitejs/plugin-react 5.0.4
- **TypeScript:** 5.9.3
- **Build Backend:** esbuild 0.25.0
- **Dev Server:** tsx 4.19.1 (watch mode)
- **Testing:** Vitest 2.1.4
- **Package Manager:** pnpm 10.4.1
- **Formatting:** Prettier 3.6.2

#### Manus Integration
- **Plugin:** vite-plugin-manus-runtime 0.0.57
- **Note:** Manus est la couche frontend/écosystème qui héberge l'application

#### Configuration Spéciale
```json
"patchedDependencies": {
  "wouter@3.7.1": "patches/wouter@3.7.1.patch"
},
"overrides": {
  "tailwindcss>nanoid": "3.3.7"
}
```

---

## 📁 STRUCTURE DU PROJET

**Fichier source:** `tsconfig.json`

```
project/
├── client/          # Frontend React
│   └── src/
├── server/          # Backend Express + tRPC
│   └── _core/
│       └── index.ts (point d'entrée)
├── shared/          # Code partagé (types, utils)
├── drizzle/         # Schémas et migrations DB
│   └── schema.ts
├── public/          # Assets statiques
├── patches/         # Patches pnpm
├── .github/         # CI/CD
└── .manus/          # Configuration Manus
```

### Alias de Chemins
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`

---

## 🎨 ÉTAT DES FONCTIONNALITÉS

**Fichiers sources:** `audit-findings.md`, `LINGUEEFY_FEATURES_SUMMARY.md`, `todo.md`

### ✅ Pages Publiques Complètes
- **Homepage** - Hero, coaches vedettes, propositions de valeur
- **Coaches Page** - Liste de 7 coaches avec filtres (langue, SLE, prix)
- **Pricing Page** - Tiers de tarification, structure de commission
- **For Departments (B2B)** - Packages entreprise, formulaire de contact
- **About Page** - Histoire, mission, valeurs, leadership
- **Ecosystem Landing** - Page d'accueil multi-marques avec carrousel

### ✅ Fonctionnalités Implémentées
- **Bilinguisme complet** (EN/FR) avec toggle dans l'en-tête
- **Thème toggle** (Glass/Light mode)
- **Design Glassmorphism** cohérent sur toutes les pages
- **6 coaches réels** avec photos, vidéos YouTube, évaluations
- **Curriculum RusingÂcademy** - 6 parcours d'apprentissage (A1 à C1+)
- **Prof Steven AI** - Partenaire de pratique IA, tests de placement, simulations d'examen
- **Footer cohérent** - "© 2026 Rusinga International Consulting Ltd."

### 🎯 Coaches Vedettes (6 profils réels)
| Coach | Langues | Photo | Vidéo | Note |
|-------|---------|-------|-------|------|
| Steven Rusinga | FR + EN | ✅ | ✅ YouTube | 4.90 |
| Sue-Anne Richer | FR + EN | ✅ | ✅ YouTube | 4.75 |
| Erika Séguin | EN only | ✅ | ✅ YouTube | 4.80 |
| Soukaina Haidar | FR only | ✅ | ✅ YouTube | 4.85 |
| Victor Amisi | FR only | ✅ | ✅ YouTube | 4.70 |
| Preciosa Baganha | EN only | ✅ | ✅ YouTube | 4.65 |

### 🚧 Fonctionnalités en Développement
- [ ] Coach profile setup wizard
- [ ] Admin coach approval workflow
- [ ] Session management (upcoming, past, cancelled)
- [ ] Progress tracking (SLE level progression)
- [ ] Calendar and availability management
- [ ] Booking system complet
- [ ] Messaging system en temps réel
- [ ] Video sessions integration
- [ ] Admin panel complet
- [ ] Stripe Connect pour paiements

---

## 🎨 DESIGN & ACCESSIBILITÉ

### Couleurs de Marque
- **RusingÂcademy:** Teal #1E9B8A (Orange dans certains contextes)
- **Lingueefy:** Cyan/Teal #009688 / #17E2C6
- **Barholex Media:** Gold #D4A853

### Standards d'Accessibilité (WCAG)
- ✅ Ratios de contraste (minimum 4.5:1)
- ✅ Navigation au clavier
- ✅ États de focus visibles
- ✅ Labels ARIA sur éléments interactifs
- ✅ Labels de formulaires accessibles

---

## 🗺️ ROUTES PRINCIPALES

| Route | Page | Description |
|-------|------|-------------|
| `/` | Ecosystem Landing | Point d'entrée principal avec toutes les marques |
| `/ecosystem` | Ecosystem Landing | Alias pour la page principale |
| `/lingueefy` | Lingueefy Home | Jumelage coach & outils IA |
| `/home` | Lingueefy Home | Alias |
| `/rusingacademy` | RusingÂcademy | Path Series™ curriculum |
| `/barholex-media` | Barholex Media | Production média & coaching |
| `/coaches` | Coach Browsing | Trouver des coaches SLE |
| `/community` | Community | Forum, événements, ressources |
| `/contact` | Contact | Formulaire de contact |

---

## 🔍 POINTS D'ATTENTION POUR LE DIAGNOSTIC

### 1. Configuration DNS/Domaine (URGENT)
- Le domaine rusingacademy.ca est actuellement "parked" sur GoDaddy
- Nécessite une configuration DNS pour pointer vers Manus
- Vérifier la configuration Manus Settings → Domains

### 2. Intégration Manus
- Plugin vite-plugin-manus-runtime version 0.0.57
- Vérifier la compatibilité avec la version actuelle de Manus
- S'assurer que les variables d'environnement sont correctement configurées

### 3. Base de Données
- MySQL avec Drizzle ORM
- Variable d'environnement DATABASE_URL requise
- Schéma dans `./drizzle/schema.ts`
- Vérifier les migrations et la connexion DB

### 4. Variables d'Environnement Critiques
```bash
DATABASE_URL=          # Connexion MySQL
NODE_ENV=              # development | production
AWS_*=                 # Credentials S3 pour uploads
STRIPE_*=              # Clés API Stripe (futur)
```

### 5. Images du Carrousel Hero
- Audit mentionne que les images du carrousel ne se chargent pas
- Affiche le texte alt au lieu des images
- Vérifier les chemins d'images dans le code

### 6. Cohérence Multi-Marques
- Trois marques distinctes avec identités visuelles différentes
- S'assurer que le routing et le branding sont cohérents
- Vérifier les redirections entre domaines

---

## 📊 MÉTRIQUES DU PROJET

- **Total de fonctionnalités implémentées:** 472+ items
- **Nombre de fichiers dans Drive:** 50 (10 dossiers, 40 fichiers)
- **Taille du todo.md:** 96.14 KB (liste extensive de tâches)
- **Coaches actifs:** 7 profils complets
- **Parcours d'apprentissage:** 6 (A1 à C1+)
- **Langues supportées:** 2 (EN/FR)

---

## 🎯 PROCHAINES ÉTAPES RECOMMANDÉES

### Immédiat (Priorité 1)
1. ✅ Configurer les enregistrements DNS dans GoDaddy
2. ✅ Connecter rusingacademy.ca à Manus
3. ✅ Vérifier les variables d'environnement (DATABASE_URL, etc.)
4. ✅ Tester la connexion à la base de données

### Court Terme (Priorité 2)
1. 🔧 Corriger les images du carrousel hero
2. 🔧 Vérifier le fonctionnement du système de booking
3. 🔧 Tester l'intégration Prof Steven AI
4. 🔧 Valider le système de paiement (si activé)

### Moyen Terme (Priorité 3)
1. 📱 Tests de responsive design sur mobile
2. 🌙 Tests du mode sombre sur toutes les pages
3. 🔐 Implémenter le workflow d'approbation des coaches
4. 💬 Développer le système de messagerie en temps réel

---

## 📝 NOTES ADDITIONNELLES

### Contexte Business
- **Client cible:** Fonctionnaires canadiens (formation SLE)
- **Modèle économique:** Commission sur sessions de coaching + packages B2B
- **Différenciateur:** IA (Prof Steven) + coaches certifiés + curriculum structuré

### Technologies Notables
- **React 19** (version très récente, sortie fin 2024)
- **TailwindCSS 4** (version majeure récente)
- **tRPC** (type-safe API sans code generation)
- **Drizzle ORM** (ORM TypeScript moderne)

### Dépendances Patchées
- **wouter@3.7.1** : Patch personnalisé appliqué (vérifier la raison dans patches/)
- **tailwindcss>nanoid** : Override vers version 3.3.7 (probablement pour sécurité)

---

## 📧 CONTACTS

- **Email admin:** admin@rusingacademy.ca
- **Fondateur:** Prof. Steven Barholere (Steven Rusinga)
- **Entreprise:** Rusinga International Consulting Ltd.

---

**Fin de l'analyse contextuelle**  
*Document généré automatiquement à partir des fichiers du Google Drive*
