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
