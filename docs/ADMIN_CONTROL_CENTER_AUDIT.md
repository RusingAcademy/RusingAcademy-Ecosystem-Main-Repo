# Admin Control Center - Audit & Architecture

## 1. AUDIT DE L'EXISTANT

### ✅ Ce qui existe et fonctionne

#### Dashboard Admin Principal (`/dashboard/admin`)
| Fonctionnalité | Status | Notes |
|----------------|--------|-------|
| Overview avec stats | ✅ | Total Users, Active Coaches, Learners, Sessions |
| Coach Applications | ✅ | Liste, approbation, rejet avec raison |
| Department Inquiries | ✅ | Gestion des demandes entreprises |
| Analytics | ✅ | Graphiques de performance |
| Coupons | ✅ | Création et gestion de codes promo |
| CRM complet | ✅ | Pipeline, leads, scoring, segments, webhooks |
| Email Settings | ✅ | Configuration des templates email |
| Users | ✅ | Liste, rôles, export CSV, actions bulk |

#### Content Management (`/admin/content`)
| Fonctionnalité | Status | Notes |
|----------------|--------|-------|
| Liste des cours | ✅ | Sélection par dropdown |
| Liste des modules | ✅ | Par cours sélectionné |
| Liste des leçons | ✅ | Par module sélectionné |
| Quiz Questions | ✅ | CRUD, drag & drop, import/export |
| Stats des questions | ✅ | Performance par question |

#### Autres pages Admin
| Page | Route | Status |
|------|-------|--------|
| Admin Analytics | `/admin/analytics` | ✅ |
| Admin Commission | `/admin/commission` | ✅ |
| Admin Leads | `/admin/leads` | ✅ |
| Admin Reminders | `/admin/reminders` | ✅ |

### ❌ Ce qui MANQUE (Critique)

#### A) ÉDITEUR DE COURS COMPLET
- [ ] **Création de cours** - Pas de formulaire pour créer un nouveau cours
- [ ] **Édition des métadonnées** - Titre, description, prix, thumbnail
- [ ] **Drag & Drop modules** - Réorganisation visuelle
- [ ] **Ajout de leçons** - Création de nouvelles leçons
- [ ] **Upload vidéos/audios** - Interface d'upload de médias
- [ ] **Éditeur de texte riche** - Pour contenu textuel
- [ ] **Gestion des fichiers PDF** - Upload et association
- [ ] **Paramètres de publication** - Draft/Published/Archived
- [ ] **Drip Content** - Configuration du calendrier de diffusion

#### B) GESTION DES PRIX & OFFRES
- [ ] **Édition des prix** - Modifier le prix d'un cours
- [ ] **Plans d'abonnement** - Mensuel/Annuel/Lifetime
- [ ] **Bundles** - Création de packages de cours
- [ ] **Upsells** - Configuration des ventes additionnelles
- [ ] **Order bumps** - Ajouts au checkout

#### C) PREVIEW ÉTUDIANT
- [ ] **Mode "Voir comme étudiant"** - Simulation de l'expérience
- [ ] **Preview cours** - Rendu exact du cours
- [ ] **Preview checkout** - Test du parcours d'achat
- [ ] **Preview onboarding** - Parcours d'inscription

#### D) CMS / PAGES
- [ ] **Éditeur de pages** - Landing pages, pages cours
- [ ] **Gestion navigation** - Menus, liens
- [ ] **Bibliothèque médias** - Centralisation des assets
- [ ] **SEO** - Titres, meta, slugs

#### E) MARKETING
- [ ] **Funnels** - Parcours d'inscription
- [ ] **Automations** - Triggers et actions
- [ ] **Tracking conversions** - Analytics marketing

### ⚠️ Ce qui est MAL PLACÉ / PAS ACCESSIBLE

1. **Content Management** - Page séparée, devrait être dans le dashboard admin
2. **Pas de Quick Actions** - Pas d'accès rapide aux actions fréquentes
3. **Navigation fragmentée** - Trop de pages séparées
4. **Pas de recherche globale** - Difficile de trouver un cours/utilisateur

---

## 2. ARCHITECTURE DU NOUVEAU CONTROL CENTER

### Menu Principal (Sidebar)

```
📊 DASHBOARD
   └── Overview (stats, quick actions, alertes)

📚 PRODUITS & COURS
   ├── Tous les cours
   ├── Créer un cours
   ├── Modules & Leçons
   ├── Quiz & Exercices
   ├── Bundles
   └── Learning Paths

💰 PRICING & OFFRES
   ├── Prix des cours
   ├── Plans d'abonnement
   ├── Coupons & Promos
   └── Bundles

📄 SITE & PAGES
   ├── Pages
   ├── Navigation
   ├── Blog
   ├── Médias
   └── SEO

📣 MARKETING
   ├── Funnels
   ├── Emails
   ├── Automations
   └── Analytics Marketing

👥 UTILISATEURS
   ├── Tous les utilisateurs
   ├── Étudiants
   ├── Coaches
   ├── Admins
   └── Rôles & Permissions

📈 ANALYTICS
   ├── Ventes & Revenus
   ├── Performance Cours
   ├── Engagement
   └── Conversions

👁️ PREVIEW
   ├── Voir comme étudiant
   ├── Preview cours
   └── Preview checkout

⚙️ PARAMÈTRES
   ├── Paiements (Stripe)
   ├── Domaines
   ├── Intégrations
   ├── Sécurité
   └── Export Data
```

### Quick Actions Bar (Toujours visible)

```
[+ Créer un cours] [+ Nouveau coupon] [👁️ Preview étudiant] [📊 Stats rapides]
```

---

## 3. PLAN D'IMPLÉMENTATION

### Phase 1: MVP (Priorité HAUTE) - 2-3 jours
1. **Course Editor** - Création et édition complète de cours
2. **Pricing Editor** - Modification des prix
3. **Student Preview** - Mode preview

### Phase 2: Pro - 3-4 jours
4. **Media Library** - Upload et gestion des médias
5. **Quick Actions Bar** - Actions rapides
6. **Navigation unifiée** - Sidebar complète

### Phase 3: Advanced - 4-5 jours
7. **Bundles & Paths** - Packages de cours
8. **Drip Content** - Calendrier de diffusion
9. **Marketing Tools** - Funnels et automations

---

## 4. SPÉCIFICATIONS TECHNIQUES

### Backend (tRPC Procedures à créer)

```typescript
// Course Management
admin.createCourse
admin.updateCourse
admin.deleteCourse
admin.duplicateCourse
admin.publishCourse
admin.archiveCourse

// Module Management
admin.createModule
admin.updateModule
admin.deleteModule
admin.reorderModules

// Lesson Management
admin.createLesson
admin.updateLesson
admin.deleteLesson
admin.reorderLessons
admin.uploadMedia

// Pricing
admin.updateCoursePrice
admin.createBundle
admin.updateBundle

// Preview
admin.getStudentPreview
admin.getCheckoutPreview
```

### Frontend (Pages à créer)

```
/dashboard/admin/courses          - Liste des cours
/dashboard/admin/courses/new      - Créer un cours
/dashboard/admin/courses/[id]     - Éditer un cours
/dashboard/admin/courses/[id]/modules - Gérer modules
/dashboard/admin/courses/[id]/preview - Preview étudiant
/dashboard/admin/pricing          - Gestion des prix
/dashboard/admin/bundles          - Gestion des bundles
/dashboard/admin/media            - Bibliothèque médias
```

### Composants UI à créer

```
CourseEditor.tsx          - Éditeur de cours complet
ModuleEditor.tsx          - Éditeur de modules drag & drop
LessonEditor.tsx          - Éditeur de leçons
MediaUploader.tsx         - Upload de médias
PriceEditor.tsx           - Éditeur de prix
StudentPreviewMode.tsx    - Mode preview
QuickActionsBar.tsx       - Barre d'actions rapides
AdminSidebar.tsx          - Navigation sidebar
```

---

## 5. DÉCISIONS DE DESIGN

1. **Sidebar fixe** - Navigation toujours visible
2. **Breadcrumbs** - Contexte de navigation
3. **Auto-save** - Sauvegarde automatique des modifications
4. **Confirmations** - Dialogs pour actions destructives
5. **Toast notifications** - Feedback des actions
6. **Drag & Drop** - Pour réorganisation (dnd-kit)
7. **Rich Text Editor** - TipTap ou Slate
8. **High Contrast** - Design accessible

---

*Document généré le 2026-02-06*
*Prochaine étape: Implémentation Phase 1 (Course Editor + Pricing + Preview)*
