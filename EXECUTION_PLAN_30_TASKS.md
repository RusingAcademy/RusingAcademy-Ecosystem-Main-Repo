# RusingÂcademy Ecosystem — 30-Task Execution Plan

**Date:** 7 février 2026  
**Base:** Checkpoint `05f22e63` (Phase 3b validated)  
**Architecture:** Unified Dashboard Shell (`/app`) + Learn Portal immersif (`/learn`)  
**Constraint:** Surgical, non-destructif, WCAG AA, glassmorphism aesthetic

---

## Priority Legend

| Priority | Meaning | SLA |
|----------|---------|-----|
| **P0** | Critical path — blocks other work | Execute immediately |
| **P1** | High value — core product experience | Execute this sprint |
| **P2** | Polish & hardening — production readiness | Execute before launch |

---

## BLOC A — Learn Portal Immersif (`/learn/:courseId`) — 12 tâches

### Task #1 · P0 · **Câbler LessonViewer dans LearnLayout** (Size: M)

1. **Titre:** Intégrer LessonViewer comme enfant de LearnLayout via route imbriquée
2. **Objectif:** Actuellement `/learn/:courseId/:lessonId` rend LessonViewer en standalone (avec son propre header/sidebar). Il faut le rendre à l'intérieur du shell LearnLayout pour une expérience immersive continue.
3. **Scope:**
   - `client/src/App.tsx` — modifier la route `/learn/:courseId/:lessonId` pour wrapper LessonViewer dans LearnLayout
   - `client/src/pages/LessonViewer.tsx` — ajouter le pattern `useAppLayout` pour masquer header/footer/sidebar quand rendu dans LearnLayout
   - `client/src/components/LearnLayout.tsx` — s'assurer que `{children}` reçoit le contenu de la leçon
4. **Definition of Done:**
   - [ ] `/learn/course-slug/42` rend LessonViewer à l'intérieur de LearnLayout (sidebar modules visible, bottom bar visible)
   - [ ] La sidebar gauche met en surbrillance la leçon active
   - [ ] Les boutons Previous/Next du bottom bar naviguent entre les leçons
   - [ ] `/courses/:slug/lessons/:id` continue de fonctionner en standalone (rétrocompatibilité)
   - [ ] Vitest: test de routing vérifiant que la route imbriquée est correcte
5. **Risques:** LessonViewer a 809 lignes avec son propre layout interne — il faut conditionner son rendu sans casser le standalone.
6. **Estimation:** M

---

### Task #2 · P0 · **Implémenter la navigation linéaire Previous/Next fonctionnelle** (Size: M)

1. **Titre:** Connecter les boutons Previous/Next du bottom bar à la vraie liste de leçons
2. **Objectif:** Les boutons Previous/Next dans LearnLayout existent visuellement mais doivent naviguer réellement entre les leçons du cours, dans l'ordre des modules et du sortOrder.
3. **Scope:**
   - `client/src/components/LearnLayout.tsx` — lignes 650-695 (bottom control bar)
   - `flatLessons` array (ligne 109) — déjà calculé, connecter aux boutons
4. **Definition of Done:**
   - [ ] Clic sur "Next" navigue vers la leçon suivante dans l'ordre (même module ou module suivant)
   - [ ] Clic sur "Previous" navigue vers la leçon précédente
   - [ ] Bouton "Previous" désactivé sur la première leçon, "Next" désactivé sur la dernière
   - [ ] Raccourcis clavier Alt+← / Alt+→ fonctionnels
   - [ ] Transition fluide sans rechargement complet
5. **Risques:** L'ordre `flatLessons` doit respecter le sortOrder des modules ET des leçons.
6. **Estimation:** M

---

### Task #3 · P0 · **Implémenter Mark Complete avec persistance** (Size: M)

1. **Titre:** Connecter le bouton "Mark Complete" au backend `lessons.markComplete`
2. **Objectif:** Permettre à l'apprenant de marquer une leçon comme terminée, avec mise à jour immédiate de la progression dans la sidebar et le bottom bar.
3. **Scope:**
   - `client/src/components/LearnLayout.tsx` — bottom bar, bouton central "Mark Complete"
   - `server/routers/lessons.ts` — procédure `markComplete` (ligne 241, déjà existante)
   - `client/src/components/LearnLayout.tsx` — sidebar lesson list (icônes CheckCircle2)
4. **Definition of Done:**
   - [ ] Clic sur "Mark Complete" appelle `trpc.lessons.markComplete`
   - [ ] L'icône de la leçon passe de Circle à CheckCircle2 (vert) immédiatement (optimistic update)
   - [ ] La barre de progression du module se met à jour
   - [ ] Si la leçon est déjà complétée, le bouton affiche "Completed ✓" (désactivé)
   - [ ] Auto-navigation vers la leçon suivante après marquage (optionnel, configurable)
5. **Risques:** Nécessite que l'utilisateur soit authentifié et inscrit au cours.
6. **Estimation:** M

---

### Task #4 · P0 · **Auto-resume : reprendre là où l'apprenant s'est arrêté** (Size: S)

1. **Titre:** Implémenter l'auto-resume basé sur `lastAccessedLesson` du backend
2. **Objectif:** Quand un apprenant accède à `/learn/:courseId` sans lessonId, le rediriger automatiquement vers sa dernière leçon consultée.
3. **Scope:**
   - `client/src/pages/LearnPortal.tsx` — ajouter logique de redirection
   - `server/routers/lessons.ts` — procédure `getCourseProgress` (retourne déjà `lastAccessedLesson`)
4. **Definition of Done:**
   - [ ] `/learn/course-slug` redirige vers `/learn/course-slug/42` (dernière leçon consultée)
   - [ ] Si aucune leçon consultée, redirige vers la première leçon du premier module
   - [ ] Si l'utilisateur n'est pas inscrit, affiche la page d'overview du cours (LearnPortal actuel)
   - [ ] Transition fluide sans flash de contenu
5. **Risques:** Dépend de la procédure `getCourseProgress` qui doit retourner un `lastAccessedLesson` fiable.
6. **Estimation:** S

---

### Task #5 · P1 · **Sidebar modules/leçons : arbre interactif avec progression** (Size: M)

1. **Titre:** Améliorer la sidebar gauche avec un arbre de modules/leçons interactif et indicateurs de progression
2. **Objectif:** La sidebar doit afficher clairement les modules (accordéon), les leçons (avec icônes de type et statut), et la progression globale du cours.
3. **Scope:**
   - `client/src/components/LearnLayout.tsx` — lignes 300-450 (sidebar content)
   - Utiliser les données de `progressData.modules` pour les statuts
4. **Definition of Done:**
   - [ ] Chaque module est un accordéon collapsible avec barre de progression
   - [ ] Chaque leçon affiche : icône de type (video/text/quiz), titre, durée estimée, statut (not_started/in_progress/completed)
   - [ ] Le module contenant la leçon active est automatiquement ouvert
   - [ ] Clic sur une leçon navigue vers elle
   - [ ] Progression globale du cours affichée en haut de la sidebar (pourcentage + barre)
   - [ ] Responsive : sidebar se transforme en drawer sur mobile
5. **Risques:** Performance si le cours a beaucoup de modules/leçons — utiliser virtualisation si > 100 items.
6. **Estimation:** M

---

### Task #6 · P1 · **Bouton "Back to Dashboard" et breadcrumb contextuel** (Size: S)

1. **Titre:** Ajouter un bouton de retour au dashboard et un breadcrumb dans le top bar de LearnLayout
2. **Objectif:** L'apprenant doit pouvoir quitter le portail immersif facilement et savoir où il se trouve dans la hiérarchie.
3. **Scope:**
   - `client/src/components/LearnLayout.tsx` — top bar (lignes 220-290)
4. **Definition of Done:**
   - [ ] Bouton "← Back to Dashboard" dans le coin supérieur gauche, navigue vers `/app`
   - [ ] Breadcrumb : Dashboard > Course Name > Module Name > Lesson Title
   - [ ] Breadcrumb responsive (tronqué sur mobile, complet sur desktop)
   - [ ] Accessible : aria-label sur le breadcrumb
5. **Risques:** Aucun risque majeur.
6. **Estimation:** S

---

### Task #7 · P1 · **AI Companion panel : chat fonctionnel** (Size: L)

1. **Titre:** Connecter le panneau AI Companion à la procédure LLM backend
2. **Objectif:** Le panneau droit (déjà scaffoldé) doit permettre à l'apprenant de poser des questions contextuelles sur la leçon en cours, avec réponses en streaming.
3. **Scope:**
   - `client/src/components/LearnLayout.tsx` — lignes 501-640 (AI panel)
   - `server/routers/sleCompanion.ts` — procédure existante pour le chat AI
   - `server/_core/llm.ts` — helper `invokeLLM`
4. **Definition of Done:**
   - [ ] L'apprenant peut taper une question et recevoir une réponse contextualisée
   - [ ] Le contexte de la leçon en cours est injecté dans le prompt système
   - [ ] Quick actions fonctionnelles (Vocabulary, Grammar, Pronunciation, Exam Tips)
   - [ ] Rendu Markdown des réponses avec `<Streamdown>`
   - [ ] Historique de conversation persistant pendant la session
   - [ ] Panel collapsible avec animation fluide
5. **Risques:** Latence LLM — implémenter un skeleton/typing indicator. Coût API si pas de rate limiting.
6. **Estimation:** L

---

### Task #8 · P1 · **Progression visuelle : barre de cours + certificat de complétion** (Size: M)

1. **Titre:** Afficher la progression globale du cours et déclencher un certificat à 100%
2. **Objectif:** L'apprenant doit voir sa progression en temps réel et recevoir une notification/certificat quand il termine un cours.
3. **Scope:**
   - `client/src/components/LearnLayout.tsx` — sidebar header (progression globale)
   - `server/routers/certificates.ts` — procédure existante pour générer des certificats
   - Nouveau composant : `CourseCompletionDialog.tsx`
4. **Definition of Done:**
   - [ ] Barre de progression globale en haut de la sidebar (X/Y leçons, Z%)
   - [ ] Animation de la barre quand une leçon est complétée
   - [ ] À 100% : dialog de félicitations avec option de télécharger le certificat
   - [ ] Badge de complétion ajouté au profil via `trpc.gamification.awardBadge`
5. **Risques:** Dépend de la procédure `certificates.generate` — vérifier qu'elle existe et fonctionne.
6. **Estimation:** M

---

### Task #9 · P1 · **Responsive mobile : drawer sidebar + swipe navigation** (Size: M)

1. **Titre:** Adapter LearnLayout pour mobile avec sidebar en drawer et navigation par swipe
2. **Objectif:** L'expérience mobile doit être aussi fluide que le desktop, avec une sidebar qui se transforme en drawer et des gestes de navigation.
3. **Scope:**
   - `client/src/components/LearnLayout.tsx` — responsive breakpoints
   - Bottom bar : sticky sur mobile
4. **Definition of Done:**
   - [ ] Sur mobile (< 768px) : sidebar se transforme en drawer (slide from left)
   - [ ] Bouton hamburger pour ouvrir/fermer la sidebar
   - [ ] Bottom bar sticky et toujours visible
   - [ ] AI panel en fullscreen overlay sur mobile
   - [ ] Pas de scroll horizontal
   - [ ] Touch targets ≥ 44px (WCAG)
5. **Risques:** Tester sur plusieurs tailles d'écran. Le bottom bar ne doit pas chevaucher le contenu.
6. **Estimation:** M

---

### Task #10 · P1 · **Autoplay next lesson + playback speed memory** (Size: S)

1. **Titre:** Ajouter l'option autoplay et la mémorisation de la vitesse de lecture
2. **Objectif:** Pour les leçons vidéo, permettre l'enchaînement automatique et mémoriser la vitesse préférée de l'apprenant.
3. **Scope:**
   - `client/src/pages/LessonViewer.tsx` — player vidéo
   - `localStorage` pour les préférences (vitesse, autoplay toggle)
4. **Definition of Done:**
   - [ ] Toggle "Autoplay next lesson" dans le bottom bar ou les settings
   - [ ] Quand une vidéo se termine et autoplay est activé, navigation automatique vers la leçon suivante après 5s (avec countdown)
   - [ ] Vitesse de lecture mémorisée dans localStorage (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
   - [ ] Préférence restaurée au chargement
5. **Risques:** Dépend du player vidéo utilisé (YouTube embed vs. custom). Vérifier la compatibilité.
6. **Estimation:** S

---

### Task #11 · P2 · **Notes et bookmarks par leçon** (Size: M)

1. **Titre:** Permettre à l'apprenant de prendre des notes et de bookmarker des leçons
2. **Objectif:** Enrichir l'expérience d'apprentissage avec des outils de prise de notes contextuelles.
3. **Scope:**
   - Nouveau composant : `LessonNotes.tsx` (dans la sidebar ou un onglet)
   - `drizzle/schema.ts` — nouvelle table `lesson_notes` (userId, lessonId, content, timestamp)
   - `server/routers/lessons.ts` — nouvelles procédures CRUD pour les notes
4. **Definition of Done:**
   - [ ] Onglet "Notes" dans la sidebar avec éditeur Markdown simple
   - [ ] Sauvegarde automatique (debounced, 2s)
   - [ ] Bookmark toggle sur chaque leçon (étoile)
   - [ ] Liste des bookmarks accessible depuis la sidebar
   - [ ] Migration DB poussée (`pnpm db:push`)
5. **Risques:** Nouvelle table DB — migration nécessaire. Taille des notes à limiter.
6. **Estimation:** M

---

### Task #12 · P2 · **Accessibilité WCAG AA du Learn Portal** (Size: S)

1. **Titre:** Audit et correction d'accessibilité du Learn Portal complet
2. **Objectif:** S'assurer que le portail d'apprentissage respecte les critères WCAG AA pour tous les utilisateurs.
3. **Scope:**
   - `client/src/components/LearnLayout.tsx` — ARIA labels, focus management, keyboard nav
   - `client/src/pages/LessonViewer.tsx` — alt text, captions, focus trap
4. **Definition of Done:**
   - [ ] Tous les éléments interactifs ont des `aria-label` appropriés
   - [ ] Navigation complète au clavier (Tab, Enter, Escape, Arrow keys)
   - [ ] Focus visible sur tous les éléments (focus ring)
   - [ ] Contraste texte/fond ≥ 4.5:1 (AA)
   - [ ] Body text ≥ 18px comme spécifié dans le UX Blueprint
   - [ ] Skip-to-content link pour la navigation
5. **Risques:** Peut nécessiter des ajustements de couleurs dans le thème.
6. **Estimation:** S

---

## BLOC B — Role-Based Sidebar Visibility (RBAC Nav) — 8 tâches

### Task #13 · P0 · **Implémenter le filtrage RBAC réel dans la sidebar** (Size: M)

1. **Titre:** Activer le filtrage `hasMinRole` basé sur le rôle réel de l'utilisateur connecté
2. **Objectif:** Actuellement la sidebar montre toutes les sections pour l'admin. Il faut que chaque rôle ne voie que ses sections autorisées.
3. **Scope:**
   - `client/src/components/AppLayout.tsx` — `navSections.filter()` (déjà codé, vérifier que `user.role` est correctement propagé)
   - `client/src/components/AppLayout.tsx` — `hasMinRole` function et `ROLE_LEVEL` mapping
4. **Definition of Done:**
   - [ ] Learner voit : Dashboard, My Courses, My Progress, Badges, Favorites, Settings + PRACTICE
   - [ ] Coach voit : tout Learner + COACHING (My Students, Sessions, Profile, Availability, Earnings, Guide)
   - [ ] HR Admin voit : tout Coach + ORGANIZATION (Team, Compliance, Reports, Org Billing)
   - [ ] Admin voit : tout + ADMINISTRATION (links vers /admin/*)
   - [ ] Vitest : test unitaire pour chaque combinaison rôle/sections visibles
5. **Risques:** Le rôle `user` (par défaut) doit être traité comme `learner` ou avoir un accès minimal.
6. **Estimation:** M

---

### Task #14 · P0 · **Protéger les routes /app/* côté serveur par rôle** (Size: M)

1. **Titre:** Ajouter des guards RBAC sur les procédures tRPC sensibles
2. **Objectif:** La sidebar masque les liens, mais les procédures backend doivent aussi vérifier les rôles pour empêcher l'accès direct.
3. **Scope:**
   - `server/routers.ts` — ajouter des middleware `coachProcedure`, `hrProcedure` en plus de `adminProcedure`
   - `server/routers/hr.ts` — protéger avec `hrProcedure`
   - Toutes les procédures coach — protéger avec `coachProcedure`
4. **Definition of Done:**
   - [ ] `coachProcedure` middleware créé (vérifie `role in ['coach', 'hr_admin', 'admin', 'owner']`)
   - [ ] `hrProcedure` middleware créé (vérifie `role in ['hr_admin', 'admin', 'owner']`)
   - [ ] Toutes les procédures coach utilisent `coachProcedure`
   - [ ] Toutes les procédures HR utilisent `hrProcedure`
   - [ ] Tentative d'accès non autorisé retourne `FORBIDDEN` avec message clair
   - [ ] Vitest : tests pour chaque middleware avec différents rôles
5. **Risques:** Certaines procédures sont déjà `protectedProcedure` — il faut les upgrader sans casser.
6. **Estimation:** M

---

### Task #15 · P1 · **Scope coach : restreindre aux étudiants assignés** (Size: M)

1. **Titre:** Filtrer les données coach pour ne montrer que ses propres étudiants
2. **Objectif:** Un coach ne doit voir que les étudiants qui lui sont assignés, pas tous les étudiants de la plateforme.
3. **Scope:**
   - `server/routers.ts` — procédure `coach.myStudents` (filtrer par `coachId = ctx.user.id`)
   - `drizzle/schema.ts` — vérifier la relation coach-student (via `coachingSessions` ou table dédiée)
4. **Definition of Done:**
   - [ ] `coach.myStudents` retourne uniquement les étudiants ayant eu des sessions avec ce coach
   - [ ] Le dashboard coach affiche le nombre correct d'étudiants
   - [ ] Un coach ne peut pas accéder aux données d'un étudiant non assigné
   - [ ] Vitest : test avec mock de 2 coachs et étudiants croisés
5. **Risques:** La relation coach-student peut être implicite (via sessions) ou explicite (table). Vérifier le schéma.
6. **Estimation:** M

---

### Task #16 · P1 · **Scope HR : restreindre à l'organisation** (Size: M)

1. **Titre:** Filtrer les données HR pour ne montrer que les membres de son organisation
2. **Objectif:** Un HR admin ne doit voir que les utilisateurs de son organisation, pas tous les utilisateurs.
3. **Scope:**
   - `server/routers/hr.ts` — filtrer par `organizationId`
   - `drizzle/schema.ts` — vérifier la table `organizations` et la relation user-org
4. **Definition of Done:**
   - [ ] `hr.teamOverview` retourne uniquement les membres de l'organisation du HR
   - [ ] `hr.complianceReport` filtré par organisation
   - [ ] Un HR ne peut pas accéder aux données d'une autre organisation
   - [ ] Vitest : test d'isolation organisationnelle
5. **Risques:** La table `organizations` peut ne pas exister encore — migration DB possible.
6. **Estimation:** M

---

### Task #17 · P1 · **Page 403 Forbidden élégante** (Size: S)

1. **Titre:** Créer une page 403 pour les accès non autorisés
2. **Objectif:** Quand un utilisateur tente d'accéder à une section non autorisée, afficher une page élégante au lieu d'une erreur brute.
3. **Scope:**
   - Nouveau composant : `client/src/pages/Forbidden.tsx`
   - `client/src/components/AppLayout.tsx` — redirection vers 403 si section non autorisée
4. **Definition of Done:**
   - [ ] Page 403 avec design cohérent (glassmorphism, même palette)
   - [ ] Message clair : "You don't have permission to access this section"
   - [ ] Bouton "Back to Dashboard" qui ramène à `/app`
   - [ ] Bilingue (FR/EN)
5. **Risques:** Aucun risque majeur.
6. **Estimation:** S

---

### Task #18 · P1 · **Indicateurs visuels de rôle dans la sidebar** (Size: S)

1. **Titre:** Afficher le rôle de l'utilisateur et un badge dans le profil sidebar
2. **Objectif:** L'utilisateur doit savoir quel rôle il a et quelles sections lui sont accessibles.
3. **Scope:**
   - `client/src/components/AppLayout.tsx` — section profil utilisateur dans la sidebar
4. **Definition of Done:**
   - [ ] Badge de rôle coloré à côté du nom (Learner=blue, Coach=green, HR=purple, Admin=red)
   - [ ] Tooltip expliquant les permissions du rôle
   - [ ] Section "Switch Role" pour les utilisateurs multi-rôles (si applicable)
   - [ ] Bilingue
5. **Risques:** Aucun risque majeur.
6. **Estimation:** S

---

### Task #19 · P2 · **Audit log des accès RBAC** (Size: S)

1. **Titre:** Logger les tentatives d'accès RBAC (succès et échecs)
2. **Objectif:** Traçabilité des accès pour la sécurité et la conformité.
3. **Scope:**
   - `server/routers/adminStability.ts` — procédure `getAuditLog` (déjà existante)
   - Middleware RBAC — ajouter un log à chaque vérification
4. **Definition of Done:**
   - [ ] Chaque tentative d'accès RBAC est loggée (userId, role, resource, timestamp, success/fail)
   - [ ] Les logs sont consultables dans le Admin Control Center (section Activity)
   - [ ] Rétention de 90 jours
5. **Risques:** Volume de logs — implémenter une rotation.
6. **Estimation:** S

---

### Task #20 · P2 · **Tests E2E RBAC complets** (Size: M)

1. **Titre:** Écrire une suite de tests complète pour le système RBAC
2. **Objectif:** Garantir que le filtrage RBAC fonctionne correctement pour tous les rôles et toutes les routes.
3. **Scope:**
   - `server/routers/auth.test.ts` — étendre avec tests RBAC
   - Nouveau fichier : `server/rbac.test.ts`
4. **Definition of Done:**
   - [ ] Test pour chaque rôle × chaque section (matrice complète)
   - [ ] Test d'escalation de privilèges (learner essaie d'accéder à admin)
   - [ ] Test de scope coach (accès aux étudiants d'un autre coach)
   - [ ] Test de scope HR (accès aux données d'une autre org)
   - [ ] Tous les tests passent
5. **Risques:** Nécessite des fixtures de test avec différents rôles.
6. **Estimation:** M

---

## BLOC C — Admin Control Center (`/app/admin`) — 8 tâches

### Task #21 · P0 · **Intégrer AdminControlCenter dans le shell /app** (Size: M)

1. **Titre:** Migrer les routes `/admin/*` vers `/app/admin/*` dans le shell unifié
2. **Objectif:** L'Admin Control Center doit fonctionner à l'intérieur du shell `/app` avec la sidebar unifiée, au lieu d'avoir son propre layout séparé.
3. **Scope:**
   - `client/src/App.tsx` — routes `/admin/*` → `/app/admin/*`
   - `client/src/pages/AppDashboard.tsx` — ajouter les sections admin au sectionMap
   - `client/src/pages/AdminControlCenter.tsx` — adapter pour fonctionner dans AppLayout
4. **Definition of Done:**
   - [ ] `/app/admin` rend le AdminControlCenter dans le shell /app
   - [ ] La sidebar ADMINISTRATION pointe vers `/app/admin/*`
   - [ ] AdminLayout interne préservé (sub-sidebar pour les sections admin)
   - [ ] Les anciennes routes `/admin/*` redirigent vers `/app/admin/*`
   - [ ] Aucune régression sur les sections admin existantes
5. **Risques:** AdminControlCenter a son propre AdminLayout avec sub-sidebar — il faut gérer la double sidebar.
6. **Estimation:** M

---

### Task #22 · P0 · **User Management : liste, recherche, filtres** (Size: L)

1. **Titre:** Construire la page de gestion des utilisateurs avec liste paginée et filtres
2. **Objectif:** L'admin doit pouvoir voir, rechercher et filtrer tous les utilisateurs de la plateforme.
3. **Scope:**
   - `client/src/pages/AdminControlCenter.tsx` — section `users` (composant `UsersRoles`)
   - `server/routers/adminControlCenter.ts` — procédures de listing utilisateurs
4. **Definition of Done:**
   - [ ] Tableau paginé des utilisateurs (nom, email, rôle, date d'inscription, statut)
   - [ ] Recherche par nom/email
   - [ ] Filtres par rôle, statut (active/suspended), date d'inscription
   - [ ] Tri par colonnes
   - [ ] Export CSV des résultats filtrés
   - [ ] Performance : pagination côté serveur (pas de chargement de tous les users)
5. **Risques:** Volume d'utilisateurs — la pagination serveur est critique.
6. **Estimation:** L

---

### Task #23 · P0 · **User Management : invite, assign role, suspend** (Size: M)

1. **Titre:** Actions admin sur les utilisateurs : invitation, changement de rôle, suspension
2. **Objectif:** L'admin doit pouvoir inviter de nouveaux utilisateurs, changer les rôles et suspendre des comptes.
3. **Scope:**
   - `server/routers/adminControlCenter.ts` — nouvelles procédures `inviteUser`, `updateRole`, `suspendUser`
   - `drizzle/schema.ts` — champ `status` sur la table users (si pas déjà présent)
   - UI : dialogs de confirmation pour chaque action
4. **Definition of Done:**
   - [ ] Bouton "Invite User" ouvre un dialog avec email + rôle
   - [ ] Invitation envoyée par email (via notification helper)
   - [ ] Dropdown pour changer le rôle d'un utilisateur (avec confirmation)
   - [ ] Bouton "Suspend" avec raison obligatoire
   - [ ] Utilisateur suspendu ne peut plus se connecter
   - [ ] Audit log de chaque action admin
5. **Risques:** L'invitation par email nécessite un template et un flow d'onboarding.
6. **Estimation:** M

---

### Task #24 · P1 · **Coach Approval Workflow** (Size: M)

1. **Titre:** Implémenter le workflow d'approbation des coachs
2. **Objectif:** Les nouveaux coachs doivent passer par un processus d'approbation avant de pouvoir offrir des sessions.
3. **Scope:**
   - `client/src/pages/AdminCoachApplications.tsx` — déjà existant, à intégrer dans `/app/admin`
   - `server/routers/adminControlCenter.ts` — procédures d'approbation
   - `drizzle/schema.ts` — champ `approvalStatus` sur la table coaches
4. **Definition of Done:**
   - [ ] Liste des candidatures coach en attente
   - [ ] Détail de chaque candidature (profil, qualifications, expérience)
   - [ ] Boutons Approve / Reject avec commentaire
   - [ ] Notification au coach du résultat
   - [ ] Coach approuvé : rôle mis à jour, profil visible dans le répertoire
   - [ ] Coach rejeté : notification avec raison, possibilité de re-candidater
5. **Risques:** Le schéma `coaches` doit avoir un champ d'approbation.
6. **Estimation:** M

---

### Task #25 · P1 · **Content Moderation : gestion des cours** (Size: M)

1. **Titre:** Interface de modération des cours (publish, unpublish, review)
2. **Objectif:** L'admin doit pouvoir gérer le cycle de vie des cours (brouillon → review → publié → archivé).
3. **Scope:**
   - `client/src/pages/AdminControlCenter.tsx` — section `courses` (composant `CourseBuilder`)
   - `server/routers/courses.ts` — procédures de modération
4. **Definition of Done:**
   - [ ] Liste des cours avec statut (draft, in_review, published, archived)
   - [ ] Actions : Publish, Unpublish, Archive, Request Review
   - [ ] Preview du cours avant publication
   - [ ] Historique des changements de statut
   - [ ] Filtres par statut, auteur, catégorie
5. **Risques:** Les cours existants n'ont peut-être pas de champ `status` — migration possible.
6. **Estimation:** M

---

### Task #26 · P1 · **Reporting minimal : KPIs dashboard** (Size: L)

1. **Titre:** Créer un dashboard KPI pour l'admin avec métriques clés
2. **Objectif:** L'admin doit avoir une vue d'ensemble des métriques clés de la plateforme.
3. **Scope:**
   - `client/src/pages/AdminControlCenter.tsx` — section `overview` (composant `DashboardOverview`)
   - `server/routers/adminControlCenter.ts` — procédures d'agrégation
   - `server/routers/stripeKPIData.ts` — données Stripe existantes
4. **Definition of Done:**
   - [ ] Cards KPI : Total Users, Active Learners, Active Coaches, Revenue (MTD), Courses Published
   - [ ] Graphique : inscriptions par semaine (30 derniers jours)
   - [ ] Graphique : revenus par mois (6 derniers mois)
   - [ ] Top 5 cours par inscriptions
   - [ ] Taux de complétion moyen des cours
   - [ ] Données rafraîchies toutes les 5 minutes (cache côté serveur)
5. **Risques:** Agrégation SQL sur de gros volumes — optimiser avec des index et du caching.
6. **Estimation:** L

---

### Task #27 · P2 · **Audit Logs viewer dans l'admin** (Size: M)

1. **Titre:** Interface de consultation des logs d'audit dans l'Admin Control Center
2. **Objectif:** L'admin doit pouvoir consulter l'historique des actions importantes sur la plateforme.
3. **Scope:**
   - `client/src/pages/AdminControlCenter.tsx` — section `activity` (composant `ActivityLogs`)
   - `server/routers/adminStability.ts` — procédure `getAuditLog` (déjà existante)
4. **Definition of Done:**
   - [ ] Tableau paginé des logs (date, utilisateur, action, cible, détails)
   - [ ] Filtres par utilisateur, action, date
   - [ ] Recherche textuelle
   - [ ] Export CSV
   - [ ] Détail expandable pour chaque entrée
5. **Risques:** Volume de logs — pagination serveur obligatoire.
6. **Estimation:** M

---

### Task #28 · P2 · **Admin notifications et alertes** (Size: S)

1. **Titre:** Système de notifications admin pour les événements critiques
2. **Objectif:** L'admin doit être notifié des événements importants (nouvelle inscription coach, paiement échoué, etc.).
3. **Scope:**
   - `server/routers/adminNotifications.ts` — déjà existant
   - `client/src/pages/AdminControlCenter.tsx` — section `notifications`
4. **Definition of Done:**
   - [ ] Badge de notification dans la sidebar admin
   - [ ] Liste des alertes récentes avec statut (read/unread)
   - [ ] Catégories : coach_signup, payment, security, system_health
   - [ ] Préférences de notification par catégorie
   - [ ] Mark as read / Mark all as read
5. **Risques:** Aucun risque majeur — les procédures backend existent déjà.
6. **Estimation:** S

---

## BLOC D — Hardening & Polish — 2 tâches

### Task #29 · P2 · **Empty states, error states, loading skeletons** (Size: M)

1. **Titre:** Audit et implémentation des états vides, erreurs et chargement sur toutes les pages /app
2. **Objectif:** Chaque page doit avoir des états visuels clairs pour le chargement, les données vides et les erreurs.
3. **Scope:**
   - Toutes les pages dans `client/src/pages/` utilisées dans AppDashboard
   - `client/src/components/` — composants réutilisables (EmptyState, ErrorState, PageSkeleton)
4. **Definition of Done:**
   - [ ] Composant `EmptyState` réutilisable (icône, titre, description, CTA)
   - [ ] Composant `ErrorState` réutilisable (icône erreur, message, bouton retry)
   - [ ] Skeleton loading pour chaque page majeure (Dashboard, Courses, Students, Team)
   - [ ] Aucune page ne montre un écran blanc pendant le chargement
   - [ ] Messages d'erreur bilingues et utiles
   - [ ] Animations de transition entre les états
5. **Risques:** Beaucoup de pages à couvrir — prioriser les pages les plus visitées.
6. **Estimation:** M

---

### Task #30 · P2 · **Performance budget et analytics instrumentation** (Size: M)

1. **Titre:** Établir un budget de performance et instrumenter les analytics
2. **Objectif:** S'assurer que l'application reste rapide et mesurer l'utilisation réelle.
3. **Scope:**
   - `vite.config.ts` — bundle splitting, lazy loading des routes
   - `client/src/App.tsx` — `React.lazy()` pour les pages lourdes
   - Analytics : `VITE_ANALYTICS_ENDPOINT` et `VITE_ANALYTICS_WEBSITE_ID` (déjà configurés)
4. **Definition of Done:**
   - [ ] Lazy loading pour toutes les pages > 50KB (AdminControlCenter, LessonViewer, CoachDashboard)
   - [ ] Bundle principal < 200KB gzipped
   - [ ] First Contentful Paint < 1.5s
   - [ ] Time to Interactive < 3s
   - [ ] Analytics : page views, session duration, feature usage
   - [ ] Error tracking : erreurs JS capturées et reportées
   - [ ] Lighthouse score ≥ 90 sur Performance
5. **Risques:** Le lazy loading peut introduire des flashes de contenu — utiliser Suspense avec fallback.
6. **Estimation:** M

---

## Résumé par priorité

| Priorité | Tâches | IDs |
|----------|--------|-----|
| **P0** (Critical) | 6 | #1, #2, #3, #4, #13, #14, #21, #22, #23 |
| **P1** (High) | 14 | #5, #6, #7, #8, #9, #10, #15, #16, #17, #18, #24, #25, #26 |
| **P2** (Polish) | 7 | #11, #12, #19, #20, #27, #28, #29, #30 |

## Ordre d'exécution recommandé

| Ordre | Task | Bloc | Priorité | Size |
|-------|------|------|----------|------|
| 1 | #1 — Câbler LessonViewer dans LearnLayout | A | P0 | M |
| 2 | #2 — Navigation linéaire Previous/Next | A | P0 | M |
| 3 | #3 — Mark Complete avec persistance | A | P0 | M |
| 4 | #4 — Auto-resume | A | P0 | S |
| 5 | #13 — Filtrage RBAC sidebar | B | P0 | M |
| 6 | #14 — Guards RBAC serveur | B | P0 | M |
| 7 | #21 — AdminControlCenter dans /app | C | P0 | M |
| 8 | #22 — User Management liste | C | P0 | L |
| 9 | #23 — User Management actions | C | P0 | M |
| 10 | #5 — Sidebar modules/leçons arbre | A | P1 | M |
| 11 | #6 — Back to Dashboard + breadcrumb | A | P1 | S |
| 12 | #7 — AI Companion chat fonctionnel | A | P1 | L |
| 13 | #8 — Progression + certificat | A | P1 | M |
| 14 | #9 — Responsive mobile LearnLayout | A | P1 | M |
| 15 | #15 — Scope coach étudiants | B | P1 | M |
| 16 | #16 — Scope HR organisation | B | P1 | M |
| 17 | #17 — Page 403 Forbidden | B | P1 | S |
| 18 | #18 — Badge de rôle sidebar | B | P1 | S |
| 19 | #24 — Coach Approval Workflow | C | P1 | M |
| 20 | #25 — Content Moderation | C | P1 | M |
| 21 | #26 — Reporting KPIs | C | P1 | L |
| 22 | #10 — Autoplay + playback speed | A | P1 | S |
| 23 | #11 — Notes et bookmarks | A | P2 | M |
| 24 | #12 — Accessibilité WCAG AA | A | P2 | S |
| 25 | #19 — Audit log RBAC | B | P2 | S |
| 26 | #20 — Tests E2E RBAC | B | P2 | M |
| 27 | #27 — Audit Logs viewer | C | P2 | M |
| 28 | #28 — Admin notifications | C | P2 | S |
| 29 | #29 — Empty/error/loading states | D | P2 | M |
| 30 | #30 — Performance + analytics | D | P2 | M |
