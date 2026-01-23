# Project TODO - Réparation des fichiers corrompus

## Fichiers corrompus identifiés

- [x] client/src/components/ProtectedRoute.tsx - balises dupliquées
- [x] client/src/pages/dashboard/Profile.tsx - balises dupliquées
- [x] client/src/pages/About.tsx - fichier vérifié OK
- [x] client/src/pages/Pricing.tsx - fichier vérifié OK
- [x] client/src/App.tsx - fichier vérifié OK
- [x] client/src/main.tsx - fichier vérifié OK

## Dépendances manquantes

- [x] bcryptjs
- [x] stripe
- [x] openai
- [x] pdfkit
- [x] nodemailer
- [x] form-data
- [x] jspdf
- [x] jspdf-autotable
- [x] react-router-dom
- [x] argon2

## Corrections Stripe (lazy loading)

- [x] server/stripe/connect.ts
- [x] server/stripe/webhook.ts
- [x] server/stripe/subscriptions.ts
- [x] server/services/stripeConnectService.ts
- [x] server/services/commissionService.ts

## Corrections OpenAI (types)

- [x] server/routes/voice.ts
- [x] server/services/pathSeriesKnowledgeBase.ts
- [x] server/services/ragService.ts

## Validation

- [x] Serveur de développement fonctionne
- [x] Page d'accueil s'affiche correctement
- [ ] Corriger les erreurs TypeScript restantes (~180)


## Corrections visuelles

- [x] Corriger l'affichage de la photo Hero (homme devant le Parlement)

## Intégration EcosystemHub

- [x] Intégrer le composant EcosystemHub du package de passation dans le site
- [x] Préserver le Header et Footer actuels (Golden/Immutable)
- [x] Remplacer le body de la page d'accueil par les sections EcosystemHub
- [x] Restaurer le Hero "Golden" original et n'intégrer que les autres sections


## Modifications Éditeur Visuel (22 janvier 2026)

- [x] Header sticky avec collapse au scroll (EcosystemHeaderGold.tsx)
- [x] Couleur de fond section ligne 735: gris clair #958e8e
- [x] Texte "Who is Steven Barholere?" → "Meet Steven Barholere."
- [x] Ajouter CTA "Book An Appointment" à la fin de la section Steven
- [x] Couleur de fond section FinalCTA ligne 1325: gris #787373
- [x] Renommer les titres de la galerie vidéo:
  - "SLE Exam Prep Tips" → "SLE Exam Prep Tips Videos"
  - "Oral Fluency Secrets" → "Podcasts"
  - "Grammar Essentials" → "Learning Capsule: Behaviorism"
  - "Level C Strategies" → "Learning Capsule: Cognitivism"
  - "Meet Sue-Anne" → "Le socio-constructivisme"

## Correction Header Sticky (22 janvier 2026)

- [x] Restaurer le header à la version précédente
- [x] Implémenter un collapse vertical subtil au scroll (sans changer largeur, sans dégradation, sans animation agressive)

- [x] Ajouter collapse vertical subtil à la Bar 1 (partie institutionnelle en haut)

## Changement de Photo (22 janvier 2026)

- [x] Remplacer la photo dans Home.tsx avec hero-option-12-all-coaches.webp
- [x] Ajouter un cadre premium autour de l'image (gradient doré, glassmorphism, glow effect)
- [x] Positionner l'image plus haut (marginTop: -2rem)

## Modifications Éditeur Visuel (22 janvier 2026)

- [x] Embellir la section après le Hero (ligne 687 Home.tsx) - rapprocher de l'image, textes visibles, design professionnel
- [x] Améliorer la section Featured Coaches (ligne 600 FeaturedCoaches.tsx) - design plus beau et captivant
- [x] Supprimer la section YouTube Videos (ligne 453 YouTubeVideos.tsx)
- [x] Supprimer la section YouTube Videos (ligne 376 YouTubeVideos.tsx)
- [x] Supprimer la section EcosystemBrands (ligne 50 EcosystemBrands.tsx)

## Modifications Éditeur Visuel (22 janvier 2026 - Batch 3)

- [x] Changer le titre H1 (ligne 703) en "La Fluidité à Votre Façon. Des Résultats Garantis."
- [x] Supprimer le paragraphe à la ligne 715
- [x] Déplacer la section (ligne 854) vers la fin de la page, juste avant le footer
- [x] Réduire la hauteur verticale de l'élément (ligne 830)

## Modifications Éditeur Visuel (22 janvier 2026 - Batch 4)

- [x] Supprimer le span à la ligne 619 de FeaturedCoaches.tsx
- [x] Déplacer la section Featured Coaches juste après le Hero
- [x] Remplacer les filtres par: Clear | All | French | English | Oral A | Oral B | Oral C | Written A | Written B | Written C | Reading | Anxiety Coaching
- [x] Supprimer l'élément à la ligne 857 de Home.tsx (CONSERVÉ - décision utilisateur)

## Modifications Éditeur Visuel (22 janvier 2026 - Batch 5)

- [x] Créer une marge à gauche et tirer le contenu vers la droite près de la photo (Home.tsx ligne 687)
- [x] Retirer les emojis drapeaux des boutons French/English (FeaturedCoaches.tsx)
- [x] Supprimer le paragraphe de description (FeaturedCoaches.tsx ligne 630)
- [x] Réduire l'épaisseur du header pour que les professeurs montent plus haut (FeaturedCoaches.tsx ligne 618)

## Modifications Éditeur Visuel (22 janvier 2026 - Batch 6)

- [x] Supprimer le Widget Prof Steven AI (ProfStevenChatbot.tsx) - déjà remplacé
- [x] Faire monter la section Featured Coaches un peu plus vers le haut (pt-10 au lieu de py-20)
- [x] Améliorer le cadre vidéo pour le rendre plus captivant et invitant (cadre premium doré/teal avec glassmorphism)
- [x] Agrandir la photo Hero pour une marge équidistante avec le texte (gap réduit, padding ajusté)

## Modification Header (22 janvier 2026)

- [x] Supprimer le deuxième sous-header (Header.tsx avec logo Lingueefy) - retiré de Coaches.tsx
- [x] Intégrer les boutons "Discover Our Courses" et "For Departments" dans le premier sous-header (LingueefySubHeader)
- [x] Préserver la clarté, la hiérarchie et la cohérence UX

## Modifications Page Coaches (22 janvier 2026)

- [x] Amener la section Hero vers le haut, juste en dessous du sous-header (py-8 md:py-12)
- [x] Rendre les statistiques dynamiques (Certified Coaches, Success Rate, Average Rating) - calculées à partir des données coaches

## Investigation Coaches (22 janvier 2026)

- [x] Investiguer pourquoi les coaches ne s'affichent pas sur la page /coaches (DB vide)
- [x] Comparer avec les données du site de production (www.rusingacademy.ca)
- [x] Créer un script de seed pour ajouter les 7 coaches dans la base de données Manus
- [x] Exécuter le script de seed et vérifier l'affichage des coaches (7 coaches affichés!)

## Modification Page RusingAcademy (22 janvier 2026)

- [x] Supprimer le deuxième sous-header (Header.tsx) de la page RusingAcademyHome.tsx

## Correction erreur page /courses (22 janvier 2026)

- [x] Créer la table courses manquante dans la base de données
- [x] Pousser les migrations avec pnpm db:push (créé manuellement via SQL)
- [x] Vérifier que la page /courses fonctionne correctement


## Amélioration Premium Écosystème (22 janvier 2026)

### RusingÂcademy (Page B - L'École)
- [x] Améliorer Hero avec focus sur "Crash Courses" intensifs pour fonctionnaires
- [x] Ajouter section "Le Problème" avec tableau comparatif (Méthode Traditionnelle vs RusingÂcademy)
- [x] Améliorer section Path Series™ avec onglets interactifs pour les 6 Paths
- [x] Ajouter section "Les Bundles" (Fast Track to BBB, Fast Track to CCC, Bilingual Excellence)
- [x] Améliorer preuve sociale avec profils cibles et témoignages

### Lingueefy (Page C - Coaching & IA)
- [x] Vérifier Hero "Double Promesse" avec visuel composite
- [x] Améliorer section de choix (Marketplace vs Plans Maison)
- [x] Ajouter Plans de Coaching "Maison" avec tableau comparatif (Starter 597$, Accelerator 1097$, Immersion 1997$)

### Barholex Media (Page D - Consulting & Studio)
- [x] Améliorer Hero "Partenaire Stratégique" B2B (Charbon + Gold) - DÉJÀ PRÉSENT
- [x] Ajouter section "Le Défi" avec 3 blocs de douleur - INTÉGRÉ dans Who We Serve
- [x] Ajouter section "Deux Piliers" (Ingénierie Pédagogique/EdTech + Communication Exécutive/Média) - DÉJÀ PRÉSENT
- [x] Améliorer section Services avec onglets interactifs - DÉJÀ PRÉSENT
- [x] Ajouter section Forfaits avec prix (EdTech Custom, Production Média 5000$, Executive Coaching 2500$) - DÉJÀ PRÉSENT
- [x] Ajouter section Clients & Preuve Sociale avec logos institutionnels - DÉJÀ PRÉSENT (Portfolio + Testimonials)

### Éléments Transversaux
- [x] Vérifier cohérence des couleurs d'accent par pilier (Navy #1E3A8A, Teal #0EA5A4, Gold #F7941D) - VALIDÉ
- [x] Harmoniser le glassmorphism sur les éléments clés - VALIDÉ
- [x] Vérifier la hiérarchie des CTAs (Primaire Orange #F97316, Secondaire outline, Tertiaire lien) - VALIDÉ
- [x] Vérifier responsive mobile-first - VALIDÉ


## Sprint 4 - Cours Path Series™, Curriculum et Stripe

### Étape 1: Cours Path Series™ dans la base de données
- [x] Créer les 6 cours Path Series™ (Path I à VI) avec données complètes
- [x] Ajouter les modules pour chaque Path
- [x] Ajouter les leçons pour chaque module (structure créée, contenu à ajouter)
- [x] Vérifier que la page /courses affiche les cours

### Étape 2: Page /curriculum
- [ ] Créer la page CurriculumPage.tsx avec vue d'ensemble des 6 Paths
- [ ] Ajouter la navigation par onglets pour chaque Path
- [ ] Afficher les modules et leçons de chaque Path
- [ ] Ajouter les CTAs d'inscription

### Étape 3: Intégration Stripe
- [ ] Activer la fonctionnalité Stripe via webdev_add_feature
- [ ] Créer les produits et prix Stripe pour les Plans Maison
- [ ] Implémenter le checkout pour les Plans Maison
- [ ] Tester le flux de paiement complet


## Sprint 5 - Contenu Officiel des Cours (Sources: rusing.academy + Google Drive)
- [x] Analyser le site rusing.academy pour extraire le contenu officiel des cours
- [x] Analyser le dossier Google Drive pour le contenu supplémentaire
- [x] Mettre à jour les données des Path Series™ avec le contenu officiel
- [x] Mettre à jour les modules et leçons avec les vrais titres et descriptions
- [x] Finaliser l'intégration Stripe pour les achats de cours
- [x] Tester le flux d'achat complet (interface prête, test avec carte 4242)


## Sprint 6 - Synchronisation GitHub (22 janvier 2026)
- [x] Auditer le repo GitHub New-RusingAcademy-Project
- [x] Comparer avec le projet Manus ecosystemhub-preview
- [x] Identifier les différences (Manus a +1 page CurriculumPathSeries, +1 service stripeCourseService)
- [x] Vérifier que le serveur fonctionne sans erreurs critiques
- [x] Valider les pages principales (/courses, /curriculum, /)
- [ ] Sauvegarder un checkpoint final
- [ ] Synchroniser vers GitHub


## Modification EcosystemHubSections (23 janvier 2026) - Règle Structurelle Globale
- [x] Appliquer la hiérarchie Titre → Lead → Contenu sur toutes les sections
- [x] Section 1: The Cost of Inaction - paragraphe fusionné sous le titre
- [x] Section 2: A Complete Ecosystem for Your Success - paragraphe fusionné sous le titre
- [x] Section 3: Our 3-Step Method - paragraphe fusionné sous le titre
- [x] Section 4: The RusingÂcademy Solution - paragraphe fusionné sous le titre
- [x] Section 5: Who benefits most from this program? - paragraphe fusionné sous le titre
- [x] Section 6: Trusted by public servants - paragraphe fusionné sous le titre
- [x] Section 7: Meet the Founder - paragraphe fusionné sous le titre
- [x] Section 8: Why Choose RusingÂcademy? - paragraphe fusionné sous le titre
- [x] Section 9: Meet our experts - paragraphe fusionné sous le titre
- [x] Section 10: Take learning beyond the session - paragraphe fusionné sous le titre
- [x] Section 11: Frequently Asked Questions - paragraphe fusionné sous le titre


## Audit Golden Standard - rusingacademy.ca (23 janvier 2026)
- [ ] Phase 1: Inventaire des pages (sitemap + liens internes)
- [ ] Phase 2: Audit automatisé Lighthouse (Mobile + Desktop) + axe-core
- [ ] Phase 3: Audit visuel (design system, contrastes, hiérarchie éditoriale)
- [ ] Phase 4: Rapport final priorisé P0/P1/P2 + Top 10 quick wins


## Audit Golden Standard COMPLET - Écosystème RusingAcademy (23 janvier 2026)

### Phase 1: Inventaire des pages
- [x] Crawl de toutes les URLs depuis les 4 points d'entrée (37 pages identifiées)
- [x] Tableau complet: URL | Section | Type | Priorité

### Phase 2: Audit automatisé
- [x] Lighthouse Desktop pour page Hub (scores: Perf 73, A11y 86, BP 100, SEO 91)
- [x] axe-core via navigation browser
- [x] Synthèse des issues récurrentes

### Phase 3: Audit visuel
- [x] Hiérarchie typographique (H1/H2/H3, lead) - Validé
- [x] Spacing vertical et alignements - Validé
- [x] Cohérence CTA et cards - Validé
- [x] Contrastes et focus states - Issues identifiées (P1)
- [x] Règle structurelle: Titre → Lead → Contenu - Appliquée sur 11 sections

### Phase 4: Corrections globales
- [x] Scroll-to-top à chaque navigation (composant ScrollToTop.tsx créé et intégré)
- [x] Header hide-on-scroll-down / show-on-scroll-up (EcosystemHeaderGold.tsx v7.0)
- [x] Ajout aria-labels pour accessibilité (liens header, boutons)

### Phase 5: Rapport final
- [x] Résumé exécutif
- [x] Liste P0/P1/P2 avec fixes (2 P0, 5 P1, 3 P2)
- [x] Top 10 quick wins
- [x] Validation comportements globaux (Scroll-to-top ✓, Header hide/show ✓)
