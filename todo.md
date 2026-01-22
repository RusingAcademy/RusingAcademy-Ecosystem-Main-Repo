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
