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
