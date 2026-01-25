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


## Corrections Visuelles (23 janvier 2026 - Session 2)
- [x] Corriger les styles dupliqués générés par l'éditeur visuel
- [x] Ajouter les boutons LinkedIn pour l'équipe d'experts (TeamSection)
- [x] Ajouter les logos des marques (RusingAcademy, Lingueefy, Barholex) dans EcosystemSection
- [x] Recadrer la photo de l'experte (TeamSection) - object-top ajouté
- [x] Améliorer les contrastes textes sur fonds sombres/clairs - TargetAudienceSection corrigé


## Règle Structurelle Globale - Pages Restantes (23 janvier 2026)
- [x] Appliquer Titre → Lead → Contenu sur RusingAcademyHome.tsx - DÉJÀ CONFORME
- [x] Appliquer Titre → Lead → Contenu sur LingueefyLanding.tsx - DÉJÀ CONFORME
- [x] Appliquer Titre → Lead → Contenu sur BarholexHome.tsx - DÉJÀ CONFORME
- [x] Valider visuellement toutes les pages - VALIDÉ


## Beautification Golden Standard - Écosystème Complet (23 janvier 2026)

### Phase 1: Corrections contrastes textes
- [x] Corriger contrastes section MethodologySection (fond #9f9393 → textes blancs)
- [x] Corriger contrastes section ValueSection (fond #ededed → textes sombres - déjà OK)
- [x] Corriger contrastes section FinalCTASection (fond #cfc9c9 → textes sombres)
- [ ] Supprimer le texte "Official logos..." comme demandé

### Phase 2: Meet Our Experts - Refonte
- [x] Layout 2-up grid sur desktop (2 par ligne)
- [x] Layout 1 par ligne sur mobile
- [x] Cards harmonisées (même hauteur, padding, typographie)
- [x] Hiérarchie: Nom → Rôle → Bio → LinkedIn
- [x] Photos: cadrage headshot, ratio uniforme
- [x] Marqué TODO pour images potentiellement IA (Sue-Anne, Preciosa)

### Phase 3: Témoignages Trust Upgrade
- [x] Photos visibles + nettes + cadrage propre (w-20 h-20 avec border-amber)
- [x] Mise en page améliorée (header séparé + quote en dessous)
- [x] Nom/rôle/organisation clairs et crédibles (hiérarchie typographique)

### Phase 4: Alternance backgrounds
- [x] Appliquer alternance blanc/gris-clair sur EcosystemHubSections (13 sections)
- [ ] Appliquer alternance sur RusingAcademyHome
- [ ] Appliquer alternance sur LingueefyLanding
- [ ] Appliquer alternance sur BarholexHome

### Phase 5: Validation finale
- [x] Scan visuel desktop - VALIDÉ
- [x] Alternance blanc/gris-clair confirmée sur toutes les sections
- [x] Meet Our Experts layout 2-up grid - VALIDÉ
- [x] Témoignages premium - VALIDÉ
- [ ] Confirmer Meet Our Experts 2-up grid
- [ ] Confirmer aucune image IA
- [ ] Confirmer témoignages inspirent confiance


## Corrections Visuelles Utilisateur (23 janvier 2026 - Suite)
- [x] Corriger le style dupliqué sur h2 FinalCTASection
- [x] Supprimer le titre "Meet the Founder" de LeadershipSection
- [x] Changer "Meet Steven Barholere." en "Steven Barholere." - APPLIQUÉ
- [ ] Attendre photo Erika Seguin pour remplacement


## Galerie Vidéo Dynamique (23 janvier 2026)
- [x] Télécharger les vidéos depuis Google Drive (12 shorts téléchargés)
- [x] Créer la section galerie vidéo captivante (fond sombre, carrousel horizontal)
- [x] Intégrer shorts (9:16) - 6 vidéos avec autoplay au hover
- [x] Ajouter animations et effets dynamiques (scale, glow, badges)
- [x] Intégrer les 8 YouTube Shorts avec embeds dynamiques
- [x] Valider le rendu visuel - VALIDÉ (8 shorts affichés avec thumbnails dynamiques)
- [ ] Intégrer Learning Capsules quand téléchargées


## Corrections Visuelles - Fonds et Contrastes (23 janvier 2026)
- [x] Corriger fond FinalCTASection (#a09c9c) et ajuster textes sombres pour contraste
- [x] Corriger fond VideoGallerySection - déjà OK avec fond sombre
- [x] Mettre à jour le lien YouTube avec youtube.com/channel/UC5aSvb7pDEdq8DadPD94qxw


## Sprint 8 - Corrections Premium Gouvernemental (23 Jan 2026)

- [ ] Fix Expert Cards - Cadrage unifié (image du haut au bas de la carte)
- [ ] Replace Steven's Photo avec la nouvelle image (nœud papillon bleu)
- [ ] Fix LinkedIn Buttons avec les vrais profils (4 membres)
- [ ] Header Behavior - Statique comme Canada.ca (scroll away, pas sticky)
- [ ] Cross-Ecosystem Section - Redesign premium sur les 3 pages (avant footer)


## Sprint 8 - Corrections Premium Gouvernemental (23 janvier 2026)

### 1. Expert Cards - Cadrage unifié
- [x] Modifier le layout des cartes experts (image gauche, contenu droite)
- [x] Image remplit toute la hauteur de la carte (200px fixe)
- [x] Uniformiser le traitement visuel des 4 cartes

### 2. Photo Steven Barholere
- [x] Remplacer la photo de Steven avec la nouvelle image (noeud papillon bleu)
- [x] Copier /upload/Steven.jpg vers /images/steven-barholere.jpg
- [x] Mettre à jour le chemin dans TeamSection

### 3. LinkedIn URLs corrigés
- [x] Steven: https://www.linkedin.com/in/steven-barholere-1a17b8a6/
- [x] Sue-Anne: https://www.linkedin.com/in/sue-anne-richer-46ab2a383/
- [x] Preciosa: https://www.linkedin.com/in/managerok/
- [x] Erika: https://www.linkedin.com/in/erika-seguin-9aaa40383/

### 4. Header Behavior - Statique Canada.ca
- [x] Changer header de "sticky top-0" à "relative"
- [x] Header scroll away complètement (pas de sticky)

### 5. CrossEcosystemSection - "Take learning beyond the session"
- [x] Créer composant premium CrossEcosystemSection.tsx
- [x] Ajouter sur EcosystemHub (page principale)
- [x] Ajouter sur RusingAcademyLanding
- [x] Ajouter sur LingueefyLanding
- [x] Ajouter sur BarholexMediaLanding
- [x] Positionner juste avant le footer sur chaque page


## Sprint 8.1 - Modifications Éditeur Visuel (23 janvier 2026)

### Corrections cartes experts
- [x] Corriger le cadrage de Preciosa (object-center au lieu de object-top)

### Section Fondateur
- [x] Ajouter section KudoboardTestimonialsSection après LeadershipSection
- [x] Images Kudoboard haute résolution (2 images: Merci Beaucoup Steven!, Merci Beacoup!)

### Section CTA Final
- [x] Supprimer le paragraphe Legal Note
- [x] Corriger les styles CSS (couleurs h2, p, boutons)

### Footer Institutionnel
- [x] Ajouter le logo RusingAcademy dans le footer


## Sprint 8.2 - Optimisation Images Kudoboard (23 janvier 2026)

### Qualité Images
- [x] Optimiser images Kudoboard pour haute résolution (qualité maximale, pas de perte au zoom)
- [x] Convertir en format optimal pour web haute qualité (PNG 2048x1770 et 1682x2048)

### Présentation Premium
- [x] Redesigner la section témoignages Kudoboard avec glassmorphism
- [x] Ajouter lightbox/modal pour zoom haute qualité
- [x] Micro-animations et effets visuels premium

### Footer
- [x] Ajouter le logo RusingAcademy dans le footer institutionnel


## Sprint 8.3 - Pinch-to-Zoom Mobile (23 janvier 2026)

### Fonctionnalité Mobile
- [x] Créer composant PinchZoomImage.tsx avec gestes tactiles
- [x] Implémenter pinch-to-zoom pour les images Kudoboard dans le lightbox
- [x] Ajouter gestes tactiles (pan, zoom, double-tap reset)
- [x] Intégrer dans EcosystemHubSections.tsx et EcosystemHub.tsx
- [x] Ajouter KudoboardTestimonialsSection dans EcosystemHubContent (manquait)
- [x] Tester lightbox avec scroll zoom et drag pan - VALIDÉ


## Sprint 8.4 - Correction Cadrage Preciosa (23 janvier 2026)
- [x] Ajuster le positionnement de la photo de Preciosa (object-position: 50% 25%) pour que son visage soit entièrement visible


## Sprint 8.5 - Remplacement Photo Preciosa (23 janvier 2026)
- [x] Remplacer la photo de Preciosa par la nouvelle image IMG_5088.JPG (copiée en team-preciosa.jpg)


## Sprint 8.6 - Modifications Visuelles Home & FeaturedCoaches (23 janvier 2026)
- [x] Supprimer la section Hero à la ligne 685 dans Home.tsx
- [x] Corriger les styles CSS multiples (erreurs de syntaxe style={{}} style={{}})
- [x] Faire de FeaturedCoaches la section Hero (supprimé l'ancien Hero)
- [x] Mettre à jour le titre "Find Your Perfect SLE Coach" avec sous-titre "Fluency Your Way. Results Guaranteed."


## Sprint 8.7 - Logo Lingueefy & Embellissement Page (23 janvier 2026)
- [x] Remplacer le logo placeholder par le vrai logo Lingueefy dans LingueefySubHeader.tsx
- [x] Analyser la page Lingueefy actuelle et identifier les améliorations
- [x] Embellir le Hero avec glassmorphism et animations premium
- [x] Améliorer les filtres avec glassmorphism
- [x] Améliorer les CoachCards avec effets de survol premium
- [x] Améliorer le bouton View All Coaches

### Corrections Audit P0/P1
- [x] Scroll-to-top à chaque changement de route (déjà implémenté dans EcosystemLayout)
- [ ] Hiérarchie éditoriale: Title → Lead → Content (pas de texte avant titre) - À FAIRE
- [ ] Contraste WCAG sur sections sombres - À FAIRE
- [ ] Focus clavier visible - À FAIRE
- [ ] Rythme vertical normalisé - À FAIRE
- [ ] Lead text plus impactant - À FAIRE
- [ ] CTA cohérents (design system) - À FAIRE


## Sprint 8.8 - Audit Contraste WCAG (23 janvier 2026)
- [x] Identifier toutes les sections avec fond sombre (bg-slate-900, bg-gray-900, etc.)
- [x] Analyser les ratios de contraste actuels
- [x] Corriger les couleurs de texte pour atteindre WCAG AA:
  - [x] Footer.tsx: text-slate-400 → text-slate-300
  - [x] FooterInstitutional.tsx: text-slate-400 → text-slate-300
  - [x] EcosystemFooter.tsx: text-gray-400/500 → text-gray-300
  - [x] FeaturedCoaches.tsx: dark:text-gray-400 → dark:text-gray-300
  - [x] DocumentVerification.tsx: dark:text-gray-400 → dark:text-gray-300
  - [x] EcosystemSwitcher.tsx: dark:text-gray-400 → dark:text-gray-300
  - [x] tokens.css: --muted #6B7280 → #4B5563 (meilleur ratio)
  - [x] tokens.css: --muted-on-dark 70% → 85% opacité
- [x] Valider les corrections sur toutes les pages


## Sprint 8.9 - Image de Fond FeaturedCoaches (23 janvier 2026)
- [x] Copier l'image InShot_20260122_165138754.jpg dans le projet (coaches-team-background.jpg)
- [x] Intégrer comme fond de la section FeaturedCoaches (backgroundSize: cover, backgroundPosition: center 20%)
- [x] Appliquer overlay premium gradient blanc semi-transparent (92% → 88% → 90% → 95%)
- [x] Conserver les orbes animés teal/gold et le grid pattern au-dessus de l'overlay
- [x] Assurer la lisibilité du texte avec glassmorphism container (z-10)


## Sprint 8.10 - Image de Fond dans Hero Box (23 janvier 2026)
- [x] Déplacer l'image de fond de la section entière vers le conteneur glassmorphism du Hero uniquement
- [x] Ajouter overlay glassmorphism (75% blanc + blur 8px) pour lisibilité
- [x] Wrapper le contenu Hero dans div z-[2] pour être au-dessus de l'overlay


## Sprint 8.11 - Améliorations Visuelles (23 janvier 2026)

### Image de fond Hero (FeaturedCoaches.tsx)
- [x] Rendre l'image de fond de l'équipe de coaching plus visible et attrayante
- [x] Réduire l'opacité de l'overlay glassmorphism de 75% à 45-55% (gradient)
- [x] Réduire le blur de 8px à 2px pour montrer clairement la professeure qui rit

### Centrage des sections (Home.tsx)
- [x] Ajouter "mx-auto px-4" à tous les containers des sections
- [x] Corriger 9 sections avec des marges équidistantes gauche/droite
- [x] Section FAQ (ligne 524)
- [x] Section Statistics (ligne 687)
- [x] Section Plans (ligne 720)
- [x] Section SLE Levels (ligne 903)
- [x] Section How It Works (ligne 960)
- [x] Section Why Choose Lingueefy (ligne 1024)
- [x] Section Testimonials (ligne 1103)
- [x] Section Video Presentation (ligne 1122)
- [x] Section CTA (ligne 1244)


## Sprint 8.12 - Refonte Premium FeaturedCoaches (23 janvier 2026)

### Mise à jour des profils LinkedIn
- [x] Soukaina Mhammedi Alaoui: https://www.linkedin.com/in/soukaina-m-hammedi-alaoui-4a0127100/
- [x] Victor Amisi: https://www.linkedin.com/in/victor-amisi-bb92a0114/
- [x] Preciosa Baganha: https://www.linkedin.com/in/managerok/
- [x] Erika Séguin: https://www.linkedin.com/in/erika-seguin-9aaa40383/

### Image de fond Hero
- [x] Rendre l'image de fond totalement visible (supprimer l'overlay opaque)
- [x] Créer un design élégant qui concilie beauté, esthétique et professionnalisme
- [x] Assurer la lisibilité du texte avec un cadre glassmorphism subtil

### Design System Premium
- [ ] Définir une échelle typographique cohérente (H1/H2/H3/body/labels)
- [ ] Créer un système d'espacement 8px
- [ ] Standardiser les boutons (primary/secondary/ghost)
- [ ] Unifier les cartes (default/featured/testimonial)
- [ ] Définir les ombres subtiles et border-radius cohérents

### Refonte des sections clés
- [x] Hero: immersif et émotionnellement fort (promesse claire + CTA primaire + action secondaire)
- [x] Coaches Grid: layout premium 2 par ligne sur desktop, photos améliorées
- [x] Social Proof: logos + ligne de crédibilité élégante
- [x] CTA Section: fond contrasté, offre claire, ligne de réassurance

### Responsive et Accessibilité
- [x] Vérifier les layouts desktop/tablet/mobile
- [x] Assurer les contrastes accessibles
- [x] Boutons suffisamment grands et texte lisible


## Sprint 8.12b - Hero Centré (23 janvier 2026)
- [x] Repositionner le cadre glassmorphism au centre-bas du Hero
- [x] Assurer que tous les visages et sourires des coaches sont visibles
- [x] Design plus compact et élégant avec texte centré


## Sprint 8.13 - Enrichissement du Contenu (23 janvier 2026)

### Section des 3 niveaux SLE (Home.tsx)
- [x] Développer des paragraphes complets sur les niveaux A, B, C
- [x] Expliquer que les coaches sont spécialisés exclusivement dans la préparation SLE
- [x] Clarifier que les coaches ne sont pas dispersés entre plusieurs branches d'enseignement

### Sections à enrichir pour convaincre et séduire
- [x] Section FAQ (ligne 524) - Développer les réponses
- [x] Section Testimonials (ligne 727) - Enrichir les témoignages
- [x] Section SLE Levels (ligne 903) - Paragraphes complets
- [x] Section How It Works (ligne 960) - Développer chaque étape
- [x] Section Why Choose Us (ligne 1024) - Arguments convaincants
- [x] Section Pricing (ligne 1104) - Clarifier les avantages
- [x] Section CTA (ligne 1218) - Message engageant
- [x] Section Contact (ligne 1246) - Invitation chaleureuse

### FeaturedCoaches.tsx
- [x] Enrichir le tagline du Hero (ligne 745)


## Sprint 8.14 - Améliorations Visuelles (23 janvier 2026)

### FeaturedCoaches.tsx - Hero Section
- [x] Repositionner le cadre glassmorphism en bas à gauche, dépassant légèrement le fond
- [x] Cacher l'ordinateur visible dans l'image de fond
- [ ] Ajouter vidéo autoplay sans son pour un effet dynamique (reporté - nécessite vidéo source)

### Home.tsx - Sections visuelles
- [x] Embellir la section SLE Levels (ligne 903) - Design premium avec orbes décoratifs, icônes, bordures colorées
- [x] Rendre les images légèrement floues dans la section How It Works (ligne 956)
- [x] Rendre les images légèrement floues dans la section Features (ligne 1024)

### Footer.tsx - Logo
- [x] Remplacer le logo par le vrai logo Lingueefy glassmorphism (lingueefy-glass-v2.png)


## Sprint 8.15 - Repositionnement Hero (23 janvier 2026)

### FeaturedCoaches.tsx - Hero Section
- [x] Déplacer le cadre glassmorphism en bas à droite
- [x] Cacher l'ordinateur visible en bas à droite de l'image
- [x] Faire dépasser légèrement le cadre du background pour l'esthétique


## Sprint 8.19 - Intégration des logos partenaires gouvernementaux

### Logos à intégrer
- [x] CDS/SNC - Service numérique canadien
- [x] Forces armées canadiennes (emblème avec couronne)
- [x] Ontario - Gouvernement provincial
- [x] Gouvernement du Canada (armoiries officielles)
- [x] IRCC - Immigration, Réfugiés et Citoyenneté Canada
- [x] Défense nationale - Ministère de la Défense
- [x] Service correctionnel Canada
- [x] Forces canadiennes (emblème sur fond noir)

### Tâches
- [x] Copier les logos dans le dossier public/images/partners/
- [x] Identifier la section Social Proof/Trusted By
- [x] Intégrer les logos avec un design premium
- [x] Pousser vers GitHub et déployer (checkpoint 8c1acc6c créé)


### Corrections demandées par l'utilisateur
- [x] Supprimer les logos partenaires en double (section après témoignages)
- [x] Déplacer les logos partenaires vers la section "They trust us" (ligne 1261)


## Sprint 8.20 - Tooltips pour les logos partenaires
- [x] Ajouter des tooltips aux 8 logos partenaires dans la section "They trust us" (bilingue EN/FR)


## Sprint 8.21 - Modifications visuelles Hero et photo Steven
- [x] Déplacer l'élément Hero vers la droite pour montrer le drapeau du Canada (ml-8 sm:ml-12 lg:ml-20 xl:ml-28)
- [x] Ajouter la phrase d'accroche française "Sécurisez votre niveau C. Propulsez votre carrière fédérale." (bilingue EN/FR)
- [x] Remplacer la photo de Steven dans EcosystemHubSections (leadership-steven.png, steven-barholere.png)
- [x] Remplacer la photo de Preciosa dans EcosystemHubSections (team-preciosa.jpg)


## Sprint 8.22 - Réorganisation des sections et modifications
- [x] Changer le titre "Steven Barholere." → "Meet Steven Barholere." (appliqué par éditeur visuel)
- [x] Remplacer l'image section ValueSection par photo podcast-studio.jpg
- [x] Déplacer ProofGallerySection (YouTube) juste après TeamSection (Meet Our Experts)
- [x] Déplacer FinalCTASection comme dernière section avant le footer (après FAQ)


## Sprint 8.23 - Amélioration du contenu et storytelling
- [x] Témoignages: Agrandir les photos (w-28 h-28) et rendre plus captivant (effet halo avec ring-4, border-4)
- [x] Section Trilemme: Élaborer le paragraphe avec storytelling (identification au problème)
- [x] Section Écosystème: Présenter les 3 piliers comme LA solution (convaincant)
- [x] Section Cibles: Élaborer davantage les profils cibles avec descriptions détaillées


## Sprint 8.24 - Ajout des liens YouTube aux boutons
- [x] Home.tsx: Ajouter lien YouTube https://youtu.be/-V3bqSxnVJg (ouvre dans nouvel onglet)
- [x] FeaturedCoaches.tsx: Ajouter 6 liens YouTube aux coaches (Steven, Sue-Anne, Erika, Soukaina, Victor, Preciosa)


## Sprint 8.25 - Intégration vidéos YouTube embedded inline
- [x] Créer composant YouTubeModal avec iframe intégrée (youtube-nocookie.com, pas de redirection externe)
- [x] Mettre à jour FeaturedCoaches.tsx pour utiliser le modal YouTube embedded (6 coaches)
- [x] Mettre à jour Home.tsx pour utiliser le modal YouTube embedded (Prof. Steven)
- [x] Design premium: glassmorphism, ambient glow, backdrop blur, transitions fluides
- [x] Layout responsive (16:9 aspect ratio, max-w-5xl, padding responsive)


## Sprint 8.26 - Intégration Bunny Storage (remplace S3 Manus)
- [x] Créer Storage Zone sur Bunny (rusingacademy-uploads, région NY)
- [x] Créer CDN Pull Zone (rusingacademy-cdn.b-cdn.net)
- [x] Créer helper bunnyStorage.ts avec API Bunny (bunnyStoragePut, bunnyStorageGet, bunnyStorageDelete, bunnyStorageList)
- [x] Configurer variables d'environnement (BUNNY_STORAGE_API_KEY, BUNNY_STORAGE_ZONE, BUNNY_STORAGE_HOSTNAME, BUNNY_CDN_URL)
- [x] Tests vitest passés (3/3) - upload, list, delete fonctionnels
- [x] Remplacer les appels storagePut() par bunnyStoragePut() dans le code existant (auto-switch Bunny/Manus S3)


## Amélioration Cartes Coaches avec Vidéos Bunny Stream (Jan 24, 2026)
- [x] Intégrer les vidéos Bunny Stream avec autoplay muet sur les cartes coaches
- [x] Ajouter les IDs vidéo Bunny pour tous les 6 coaches
- [x] Créer le modal premium plein écran pour la lecture vidéo avec son
- [x] Ajouter l'indicateur "PLAYING" avec barres audio animées
- [x] Implémenter le design glassmorphism avec bordure animée au survol
- [x] Configurer le bon Library ID Bunny (585866)


## Correction Cartes Coaches (Jan 24, 2026)
- [x] Restaurer les informations des coaches (nom, description, badges de langue, disponibilité)
- [x] Corriger les vidéos Bunny Stream qui s'arrêtent immédiatement
- [x] Valider le rendu visuel des cartes


## Modifications Visuelles Cartes Coaches (Jan 24, 2026)
- [ ] Effacer la photo de background de la section coaches
- [ ] Faire monter la section coaches juste en dessous du header
- [ ] Déplacer la décoration vers la boîte avec le titre
- [ ] Configurer le lazy loading de Bunny Stream pour les vidéos


## Modifications Visuelles Cartes Coaches (24 janvier 2026)
- [x] Effacer la photo de background de la section coaches
- [x] Faire monter la section coaches juste en dessous du header (pt-8)
- [x] Déplacer le Trust Badge "6+ Certified Coaches" vers la boîte avec le titre
- [x] Configurer les paramètres Bunny Stream pour lecture continue (autoplay, loop, muted, preload)
- [x] Corriger l'erreur JSON de validation (paramètre loading=lazy invalide supprimé)
- [x] Valider le modal vidéo avec lecture avec son


## Redesign Page RusingÂcademy (24 janvier 2026)
- [ ] Analyser la structure actuelle de la page RusingÂcademy
- [ ] Appliquer une hiérarchie forte: Titre → Lead → Contenu → CTA
- [ ] Utiliser des cartes, espacement, rythme et layering subtil
- [ ] Maintenir une haute crédibilité pour les fonctionnaires canadiens
- [ ] Utiliser des visuels authentiques et une esthétique éducative sobre
- [ ] Alterner les layouts de section pour maintenir l'attention
- [ ] Intégrer les thumbnails de cours de manière élégante
- [ ] Assurer un ton éducatif et institutionnel fort
- [ ] Valider le design final


## Redesign Premium Page RusingÂcademy (24 janvier 2026)
- [x] Appliquer le framework de design premium à la page RusingÂcademy
- [x] Intégrer les thumbnails de cours de manière élégante (path_a1 à path_c2)
- [x] Améliorer la hiérarchie visuelle (Titre → Lead → Contenu → CTA)
- [x] Ajouter des effets glassmorphism et animations subtiles
- [x] Valider le rendu professionnel et institutionnel
- [x] Intégrer l'image hero_bilingual_excellence.jpg dans le Hero
- [x] Intégrer l'image success_transformation.jpg dans les témoignages
- [x] Créer la section comparaison Traditional vs RusingÂcademy Method
- [x] Créer la section Path Series avec onglets interactifs
- [x] Créer la section Bundles avec 3 forfaits premium
- [x] Créer la section Learning Solutions
- [x] Créer la section Témoignages avec badges de niveau
- [x] Créer le CTA final avec gradient premium


## Sprint 7 - Curriculum, Stripe et Photos Coaches (24 janvier 2026)

### Phase 1: Page /curriculum
- [ ] Créer la page CurriculumPage.tsx avec vue d'ensemble des 6 Paths
- [ ] Ajouter la navigation par onglets pour chaque Path
- [ ] Afficher les modules et leçons de chaque Path
- [ ] Ajouter les CTAs d'inscription connectés à Stripe
- [ ] Intégrer les thumbnails de cours dans la page curriculum

### Phase 2: Intégration Stripe
- [ ] Connecter les boutons "Enroll Now" au checkout Stripe
- [ ] Connecter les boutons "Get Started" des Bundles au checkout Stripe
- [ ] Tester le flux de paiement complet avec carte test 4242

### Phase 3: Photos Coaches
- [ ] Identifier les photos placeholder à remplacer (Soukaina, Preciosa)
- [ ] Demander les vraies photos à l'utilisateur si nécessaire
- [ ] Remplacer les photos dans la base de données et les composants


## Sprint 7 - Checkout Stripe Connecté (24 janvier 2026)
- [x] Corriger la mutation pour utiliser stripe.createCourseCheckout
- [x] Tester le bouton "Enroll Now" sur la page RusingAcademy
- [x] Valider le flux de paiement Stripe (checkout page s'ouvre correctement)
- [x] Produit affiché: Path I: FSL - Foundations ($680.78 USD / CA$899.00)


## Modifications Visuelles (24 janvier 2026)
- [ ] Supprimer totalement le deuxième sub-header dans Header.tsx
- [ ] Mettre le logo original de RusingAcademy dans le Footer


## Modifications Visuelles (24 janvier 2026 - Suite)
- [x] Supprimer le header Lingueefy de la page /courses
- [x] Mettre le logo RusingAcademy dans le Footer


## Suppression Header Lingueefy - Pages Barholex (24 janvier 2026)
- [ ] Supprimer header Lingueefy de /barholex/services
- [ ] Supprimer header Lingueefy de /barholex/portfolio
- [ ] Supprimer header Lingueefy de /barholex/contact


## Suppression Headers Dupliqués Barholex (24 janvier 2026)
- [x] Supprimer le header Lingueefy dupliqué de /barholex/services (Services.tsx)
- [x] Supprimer le header Lingueefy dupliqué de /barholex/portfolio (Portfolio.tsx)
- [x] Supprimer le header Lingueefy dupliqué de /barholex/contact (Contact.tsx)
- [x] Supprimer le header Lingueefy dupliqué de /barholex (BarholexHome.tsx)
- [x] Vérifier que toutes les pages Barholex affichent correctement: Ecosystem header → Barholex sub-header (pas de header Lingueefy)


## Modification Layout FeaturedCoaches (24 janvier 2026)
- [x] Supprimer le cadre glassmorphism du titre dans FeaturedCoaches.tsx
- [x] Repositionner le titre plus haut sur la page (pt-2 au lieu de py-8)
- [x] Simplifier le layout en gardant uniquement badge, titre, paragraphe et trust badge

- [x] Supprimer le badge "Personalized Coaching"
- [x] Supprimer le trust badge avec les photos des coaches
- [x] Élargir le paragraphe (max-w-6xl) pour tenir sur 2 lignes max
- [x] Rendre les filtres plus compacts (px-2.5 py-1.5 text-xs) sur une ligne avec scroll horizontal


## Modifications RusingAcademyLanding (24 janvier 2026)
- [x] Changer le format des thumbnails de cours en 16:9 (aspect-video) pour afficher correctement le texte
- [x] Étirer horizontalement le Path Progress Indicator (max-w-3xl, justify-between)
- [x] Embellir le Path Progress Indicator avec des boutons plus grands (w-12 h-12), des lignes de connexion et des labels visibles

- [x] Transformer le Hero avec l'image d'équipe en arrière-plan plein écran
- [x] Centrer le texte du Hero avec overlay gradient teal-purple
- [x] Ajouter des cartes de stats flottantes en bas du Hero (3-4x, 95% Success, 2,500+)


## Réorganisation Sections RusingAcademy (Jan 24)
- [ ] Placer la section "Traditional Language Training" juste après le Hero
- [ ] Placer la section "GC Bilingual Path Series" après "Traditional Language Training"
- [ ] Élargir les thumbnails horizontalement et les mettre en format 16:9


## Réorganisation Sections RusingAcademy (24 janvier 2026)
- [x] Déplacer la section "Traditional Language Training" juste après le Hero
- [x] Placer la section "Path Series" après "Traditional Language Training"
- [x] Réorganiser l'ordre: Hero → Traditional → Path Series → Stats → Why Choose Us → Bundles
- [x] Changer le format des thumbnails YouTube Shorts de 9:16 à 16:9 (CrossEcosystemSection)
- [x] Élargir la section YouTube Shorts horizontalement avec max-w-7xl et gap-6

- [x] Élargir la carte Path Series (max-w-5xl → max-w-6xl)
- [x] Appliquer le format 16:9 sur l'image thumbnail de la carte (aspect-[16/9], min-h-[320px])

- [x] Déplacer les boutons "Enroll Now" et "View Full Curriculum" sous le thumbnail
- [x] Allonger les boutons (flex-1, px-8 py-4, text-lg)
- [x] Ajouter un fond gradient élégant (from-gray-50 to-white) sous les boutons


## Page Courses Dédiée (24 janvier 2026)
- [x] Créer le composant CoursesPage.tsx avec les données des Path Series
- [x] Implémenter les filtres par niveau (A1, A2, B1, B2, C1, Exam Prep)
- [x] Créer une grille de cartes de cours responsive
- [x] Ajouter la route /courses dans App.tsx
- [x] Intégrer les boutons Enroll Now avec Stripe checkout


## Remise Sub-Header RusingAcademy (24 janvier 2026)
- [x] Remettre le Sub-Header RusingAcademy avant la section Hero


## Sub-Header Sticky (24 janvier 2026)
- [x] Rendre le Sub-Header RusingAcademy sticky lors du défilement

- [x] Rendre le Sub-Header Lingueefy sticky
- [x] Rendre le Sub-Header Barholex sticky


## Animation Transition Sub-Headers (24 janvier 2026)
- [x] Ajouter animation de transition au Sub-Header RusingAcademy lors du scroll
- [x] Ajouter animation de transition au Sub-Header Lingueefy lors du scroll
- [x] Ajouter animation de transition au Sub-Header Barholex lors du scroll
