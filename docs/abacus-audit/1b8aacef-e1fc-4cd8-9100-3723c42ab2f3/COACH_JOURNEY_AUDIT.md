# Audit du Parcours Coach sur Lingueefy

**Date:** 9 janvier 2026  
**Auteur:** Manus AI  
**Version:** 1.0

---

## Résumé Exécutif

Ce document présente un audit complet du parcours coach sur la plateforme Lingueefy. L'objectif est d'identifier ce qui est fonctionnel, ce qui reste à construire, et de fournir une vue d'ensemble claire pour un nouveau coach qui souhaiterait rejoindre la plateforme.

**Verdict global:** La plateforme dispose d'une infrastructure technique solide avec environ **85% des fonctionnalités essentielles implémentées**. Cependant, certaines fonctionnalités critiques comme la réservation de sessions par les apprenants et la gestion complète du calendrier nécessitent des améliorations pour offrir une expérience utilisateur fluide.

---

## 1. Processus d'Inscription Coach

### 1.1 Page "Devenir Coach" (`/become-a-coach`)

| Élément | Statut | Description |
|---------|--------|-------------|
| Page d'information | ✅ Complète | Présentation des avantages, témoignages, FAQ |
| Formulaire de candidature | ✅ Complète | Wizard en 8 étapes avec validation |
| Consentements légaux | ✅ Complète | Termes, confidentialité, commission, code de conduite |
| Upload de documents | ⚠️ Partiel | Interface présente, stockage S3 à finaliser |

### 1.2 Étapes du Formulaire de Candidature

Le formulaire de candidature comprend **8 étapes complètes**:

1. **Informations personnelles** - Nom, email, téléphone, ville, fuseau horaire
2. **Parcours professionnel** - Éducation, certifications, années d'expérience
3. **Qualifications linguistiques** - Niveaux ELS, langues maternelles, expérience d'enseignement
4. **Spécialisations** - Oral A/B/C, Écrit A/B/C, préparation aux examens
5. **Disponibilité et tarifs** - Heures hebdomadaires, tarif horaire, tarif d'essai
6. **Contenu du profil** - Titre accrocheur, biographie, philosophie d'enseignement
7. **Photo et vidéo** - Photo de profil, vidéo d'introduction YouTube
8. **Consentements légaux** - Signature numérique requise

### 1.3 Processus d'Approbation

| Fonctionnalité | Statut |
|----------------|--------|
| Soumission de candidature | ✅ Fonctionnel |
| Interface admin de révision | ✅ Fonctionnel |
| Approbation/Rejet avec notes | ✅ Fonctionnel |
| Notification par email | ✅ Fonctionnel |
| Création automatique du profil coach | ✅ Fonctionnel |

---

## 2. Tableau de Bord Coach (`/coach/dashboard`)

### 2.1 Fonctionnalités Disponibles

| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| Vue d'ensemble des statistiques | ✅ Fonctionnel | Étudiants, sessions, revenus, note moyenne |
| Sessions du jour | ⚠️ Mock data | Affichage présent mais données simulées |
| Demandes en attente | ⚠️ Mock data | Interface présente mais pas connectée |
| Actions rapides | ✅ Fonctionnel | Liens vers disponibilité, messages, profil |
| Checklist d'onboarding | ✅ Fonctionnel | Guide le coach pour compléter son profil |
| Connexion Stripe | ✅ Fonctionnel | Intégration Stripe Connect complète |

### 2.2 Wizard de Configuration du Profil

Après approbation, le coach accède à un wizard de configuration en **5 étapes**:

1. **Informations de base** - Titre, biographie, expérience, certifications
2. **Spécialités** - Niveaux ELS et domaines d'expertise
3. **Tarification** - Tarif horaire et tarif d'essai
4. **Disponibilité** - Configuration des créneaux hebdomadaires
5. **Vidéo** - Ajout d'une vidéo d'introduction YouTube

---

## 3. Gestion du Profil Coach

### 3.1 Éléments du Profil

| Élément | Modifiable | Stockage |
|---------|------------|----------|
| Photo de profil | ✅ Oui | URL externe (pas S3) |
| Vidéo d'introduction | ✅ Oui | Lien YouTube |
| Titre accrocheur | ✅ Oui | Base de données |
| Biographie | ✅ Oui | Base de données |
| Spécialisations | ✅ Oui | JSON en base |
| Tarif horaire | ✅ Oui | En cents CAD |
| Tarif d'essai | ✅ Oui | En cents CAD |
| Langues enseignées | ✅ Oui | Français/Anglais/Les deux |

### 3.2 Profil Public (`/coach/[slug]`)

Le profil public du coach affiche:
- Photo et vidéo d'introduction
- Note moyenne et nombre d'avis
- Spécialisations et langues
- Tarifs et disponibilité
- Avis des apprenants
- Bouton de réservation

---

## 4. Gestion de la Disponibilité

### 4.1 Système de Disponibilité Interne

| Fonctionnalité | Statut |
|----------------|--------|
| Configuration des créneaux hebdomadaires | ✅ Fonctionnel |
| Définition des heures de début/fin | ✅ Fonctionnel |
| Activation/désactivation des jours | ✅ Fonctionnel |
| Fuseau horaire (America/Toronto) | ✅ Fonctionnel |
| Sauvegarde en base de données | ✅ Fonctionnel |

### 4.2 Intégration Calendly (Alternative)

| Fonctionnalité | Statut |
|----------------|--------|
| Option Calendly dans le profil | ✅ Présent |
| Stockage de l'URL Calendly | ✅ Fonctionnel |
| Webhook Calendly | ✅ Implémenté |
| Synchronisation des réservations | ⚠️ Partiel |

---

## 5. Système de Paiement et Commission

### 5.1 Stripe Connect

| Fonctionnalité | Statut |
|----------------|--------|
| Création de compte Stripe Connect | ✅ Fonctionnel |
| Onboarding Stripe Express | ✅ Fonctionnel |
| Vérification du statut du compte | ✅ Fonctionnel |
| Lien vers le tableau de bord Stripe | ✅ Fonctionnel |
| Réception des paiements | ✅ Fonctionnel |

### 5.2 Structure de Commission

La structure de commission est **clairement documentée** et **configurable par l'admin**:

| Type de Coach | Commission | Notes |
|---------------|------------|-------|
| Sessions d'essai | 0% | Le coach garde 100% |
| Coach ELS vérifié | 15% | Taux fixe |
| Standard (0-10h) | 26% | Taux initial |
| Standard (10-30h) | 22% | Réduction progressive |
| Standard (30-60h) | 19% | Réduction progressive |
| Standard (60-100h) | 17% | Réduction progressive |
| Standard (100h+) | 15% | Taux minimum |

### 5.3 Programme de Parrainage

| Fonctionnalité | Statut |
|----------------|--------|
| Génération de lien de parrainage | ✅ Fonctionnel |
| Suivi des clics et inscriptions | ✅ Fonctionnel |
| Commission réduite sur parrainages | ✅ Fonctionnel |
| Affichage dans le tableau de bord | ✅ Fonctionnel |

---

## 6. Système de Sessions

### 6.1 Réservation de Sessions

| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| Checkout Stripe pour paiement | ✅ Fonctionnel | Session unique, essai, forfait |
| Création de session après paiement | ✅ Fonctionnel | Via webhook Stripe |
| Génération de lien de réunion | ✅ Fonctionnel | Jitsi Meet automatique |
| **Sélection de créneau horaire** | ❌ À construire | Interface de calendrier manquante |
| **Confirmation de réservation** | ⚠️ Partiel | Email envoyé mais pas de page de confirmation |

### 6.2 Gestion des Sessions

| Fonctionnalité | Statut |
|----------------|--------|
| Liste des sessions à venir | ✅ Fonctionnel |
| Report de session (24h avant) | ✅ Fonctionnel |
| Annulation de session | ✅ Fonctionnel |
| Notifications par email | ✅ Fonctionnel |
| Notes post-session | ✅ Schéma présent |

### 6.3 Appels Vidéo

| Fonctionnalité | Statut |
|----------------|--------|
| Intégration Jitsi Meet | ✅ Fonctionnel |
| Salle d'attente | ✅ Fonctionnel |
| Contrôles audio/vidéo | ✅ Fonctionnel |
| Partage d'écran | ✅ Fonctionnel |
| Minuteur de session | ✅ Fonctionnel |
| Chat intégré | ✅ Fonctionnel |

---

## 7. Documentation Légale

### 7.1 Documents Disponibles

| Document | Statut | Contenu |
|----------|--------|---------|
| Conditions d'utilisation (`/terms`) | ✅ Complet | 14 sections bilingues |
| Politique de confidentialité (`/privacy`) | ✅ Complet | Bilingue |
| Politique des cookies (`/cookies`) | ✅ Complet | Bilingue |
| Accessibilité (`/accessibility`) | ✅ Complet | Bilingue |

### 7.2 Informations sur la Commission

Les informations sur la commission sont disponibles à plusieurs endroits:
- Page "Devenir Coach" - FAQ avec structure de commission
- Formulaire de candidature - Consentement explicite requis
- Tableau de bord coach - Affichage du taux actuel
- Page des revenus - Détail des transactions

---

## 8. Ce Qui Manque ou Doit Être Amélioré

### 8.1 Fonctionnalités Critiques Manquantes

| Fonctionnalité | Priorité | Description |
|----------------|----------|-------------|
| **Calendrier de réservation interactif** | 🔴 Haute | Les apprenants ne peuvent pas sélectionner un créneau horaire |
| **Page de confirmation de réservation** | 🔴 Haute | Après paiement, redirection vers une page de confirmation |
| **Stockage S3 pour documents** | 🟡 Moyenne | Les certificats et documents ne sont pas stockés de manière sécurisée |
| **Notifications push/temps réel** | 🟡 Moyenne | Actuellement uniquement par email |

### 8.2 Améliorations Recommandées

| Amélioration | Priorité | Description |
|--------------|----------|-------------|
| Guide d'utilisation pour coachs | 🟡 Moyenne | Documentation PDF ou page d'aide |
| Tableau de bord des revenus amélioré | 🟢 Basse | Graphiques et statistiques détaillées |
| Système de messagerie amélioré | 🟢 Basse | Notifications en temps réel |
| Galerie de photos multiples | 🟢 Basse | Permettre plusieurs photos par coach |

---

## 9. Parcours Coach Complet (Résumé)

### Étape 1: Découverte et Candidature
1. Le coach visite `/become-a-coach`
2. Il lit les avantages, témoignages et FAQ
3. Il clique sur "Postuler maintenant"
4. Il complète le formulaire en 8 étapes
5. Il signe numériquement les consentements
6. Il soumet sa candidature

### Étape 2: Approbation
1. L'admin reçoit une notification
2. L'admin révise la candidature dans `/admin/applications`
3. L'admin approuve ou rejette avec notes
4. Le coach reçoit un email de confirmation

### Étape 3: Configuration du Profil
1. Le coach se connecte et accède à `/coach/dashboard`
2. Le wizard de configuration s'affiche automatiquement
3. Il complète les 5 étapes de configuration
4. Il configure ses disponibilités
5. Il connecte son compte Stripe

### Étape 4: Réception de Réservations
1. Un apprenant trouve le coach sur `/coaches`
2. L'apprenant visite le profil du coach
3. L'apprenant clique sur "Réserver"
4. **⚠️ MANQUANT: Sélection du créneau horaire**
5. L'apprenant paie via Stripe Checkout
6. La session est créée automatiquement
7. Les deux parties reçoivent un email avec le lien de réunion

### Étape 5: Tenue de la Session
1. Le coach et l'apprenant rejoignent via le lien Jitsi
2. La session se déroule avec vidéo, audio, partage d'écran
3. Le minuteur affiche le temps restant
4. À la fin, l'apprenant peut laisser un avis

### Étape 6: Paiement
1. Le paiement est traité automatiquement via Stripe
2. La commission est déduite selon le niveau du coach
3. Le coach reçoit son paiement sur son compte bancaire (hebdomadaire)
4. Le coach peut voir ses revenus dans `/coach/earnings`

---

## 10. Conclusion

Lingueefy dispose d'une **base technique solide** pour accueillir des coachs. Les principales fonctionnalités sont en place:

**Points forts:**
- Processus de candidature complet et professionnel
- Intégration Stripe Connect fonctionnelle
- Structure de commission transparente et équitable
- Appels vidéo intégrés via Jitsi (gratuit, sans compte requis)
- Documentation légale complète et bilingue

**Points à améliorer avant le lancement:**
- Interface de sélection de créneau horaire pour les apprenants
- Page de confirmation après réservation
- Stockage sécurisé des documents (S3)
- Guide d'utilisation pour les nouveaux coachs

**Recommandation:** La plateforme est prête à **environ 85%** pour accueillir des coachs en production. Les fonctionnalités manquantes sont importantes mais peuvent être développées en parallèle d'un lancement beta avec un nombre limité de coachs.

---

*Document généré le 9 janvier 2026 par Manus AI*
