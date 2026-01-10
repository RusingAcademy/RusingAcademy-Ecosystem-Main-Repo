# Comparaison des Fonctionnalités de Paiement : Écosystème vs Kajabi Pro

**Date**: 10 janvier 2026  
**Auteur**: Manus AI

---

## Tableau Comparatif Détaillé

| Fonctionnalité | Kajabi Pro | Votre Écosystème | Statut |
|----------------|------------|------------------|--------|
| **Infrastructure de Base** | | | |
| Processeur de paiement | Kajabi Payments (basé sur Stripe) | Stripe Connect | ✅ Équivalent |
| Cartes crédit/débit | Visa, Mastercard, Amex | Visa, Mastercard, Amex | ✅ Équivalent |
| Disponibilité Canada | Oui | Oui | ✅ Équivalent |
| Calcul taxes automatique | HST/GST/PST | HST Ontario (13%) | ✅ Implémenté |
| | | | |
| **Modes de Paiement** | | | |
| Paiement unique (one-time) | Oui | Oui | ✅ Équivalent |
| Plans de paiement (installments) | Oui (X paiements sur Y mois) | Non | ❌ Manquant |
| Abonnements récurrents | Oui (mensuel/annuel) | Non | ❌ Manquant |
| Packages/Bundles | Oui | Oui (5 ou 10 sessions) | ✅ Équivalent |
| | | | |
| **Méthodes de Paiement Alternatives** | | | |
| Apple Pay | Oui | Non | ❌ Manquant |
| Google Pay | Oui | Non | ❌ Manquant |
| Klarna (BNPL) | Oui | Non | ❌ Manquant |
| Afterpay (BNPL) | Oui | Non | ❌ Manquant |
| PayPal | Oui (intégration séparée) | Non | ❌ Manquant |
| | | | |
| **Checkout & Conversion** | | | |
| Pages de checkout | Oui (personnalisables) | Oui (Stripe Checkout) | ✅ Équivalent |
| Codes promo/Coupons | Oui (création dans Kajabi) | Oui (via Stripe Promotion Codes) | ✅ Équivalent |
| Order Bumps | Oui | Non | ❌ Manquant |
| Upsells post-achat | Oui | Non | ❌ Manquant |
| Checkout multi-produits | Oui (Kajabi Cart) | Non (1 produit par checkout) | ❌ Manquant |
| | | | |
| **Marketplace & Payouts** | | | |
| Comptes vendeurs multiples | Non (single-vendor) | Oui (Stripe Connect Express) | ✅ Supérieur |
| Split automatique des paiements | Non | Oui (commission plateforme) | ✅ Supérieur |
| Dashboard vendeur séparé | Non | Oui (Stripe Express Dashboard) | ✅ Supérieur |
| Payouts automatiques aux coachs | Non applicable | Oui | ✅ Supérieur |
| | | | |
| **Gestion des Transactions** | | | |
| Remboursements | Oui | Oui (avec reversal des frais) | ✅ Équivalent |
| Reçus automatiques | Oui | Oui (via Stripe) | ✅ Équivalent |
| Historique des paiements | Oui | Oui (ledger des transactions) | ✅ Équivalent |
| Gestion des litiges | Oui | Oui (via Stripe Dashboard) | ✅ Équivalent |
| | | | |
| **Abonnements & Récurrence** | | | |
| Création d'abonnements | Oui | Non | ❌ Manquant |
| Pause d'abonnement | Oui | Non | ❌ Manquant |
| Annulation d'abonnement | Oui | Non | ❌ Manquant |
| Changement de plan | Oui | Non | ❌ Manquant |
| Portail client self-service | Oui | Non | ❌ Manquant |
| Relance automatique (dunning) | Oui | Non | ❌ Manquant |
| | | | |
| **Frais de Transaction** | | | |
| Frais Kajabi Pro | 2.7% + $0.30 | N/A | |
| Frais Stripe standard | N/A | 2.9% + $0.30 | |
| Frais tiers (non-Kajabi Payments) | 0.5% additionnel | 0% | ✅ Supérieur |

---

## Analyse par Catégorie

### 1. Points où l'Écosystème est SUPÉRIEUR à Kajabi Pro

**Architecture Marketplace (Stripe Connect)**

Votre écosystème utilise Stripe Connect en mode Express, ce qui offre des capacités que Kajabi ne propose pas nativement :

- **Multi-vendeurs** : Chaque coach a son propre compte Stripe avec accès à son dashboard
- **Split automatique** : Les paiements sont automatiquement divisés entre le coach et la plateforme
- **Commissions flexibles** : Système de tiers avec commissions dégressives (26% → 15%)
- **Payouts directs** : Les coachs reçoivent leurs fonds directement sans intervention manuelle

Kajabi est une plateforme "single-vendor" où tout l'argent va au propriétaire du site. Pour un modèle marketplace comme le vôtre, vous auriez besoin d'outils externes avec Kajabi.

**Pas de frais additionnels de plateforme**

Kajabi Pro facture 0.5% sur les transactions utilisant un processeur tiers (Stripe direct). Votre écosystème n'a pas ce surcoût.

### 2. Points où Kajabi Pro est SUPÉRIEUR

**Abonnements récurrents**

Kajabi offre une gestion complète des abonnements :
- Création de plans mensuels/annuels
- Portail client pour gérer son abonnement
- Pause/reprise d'abonnement
- Relance automatique en cas d'échec de paiement
- Changement de plan (upgrade/downgrade)

**Méthodes de paiement alternatives**

Kajabi Payments inclut :
- Apple Pay et Google Pay (paiement en 1 clic)
- Klarna et Afterpay (Buy Now Pay Later)
- Ces options peuvent augmenter les conversions de 10-20%

**Optimisation du checkout**

Kajabi offre des outils de conversion avancés :
- **Order Bumps** : Produits additionnels proposés au checkout
- **Upsells** : Offres post-achat pour augmenter le panier moyen
- **Multi-produits** : Panier avec plusieurs produits en une transaction

### 3. Points ÉQUIVALENTS

| Fonctionnalité | Commentaire |
|----------------|-------------|
| Paiements par carte | Même infrastructure Stripe |
| Codes promo | `allow_promotion_codes: true` activé dans votre checkout |
| Remboursements | Gestion complète avec reversal des frais |
| Taxes | HST calculé automatiquement |
| Sécurité | PCI-DSS compliant via Stripe |

---

## Score Global des Fonctionnalités de Paiement

| Catégorie | Kajabi Pro | Écosystème | Gagnant |
|-----------|------------|------------|---------|
| Infrastructure de base | 10/10 | 10/10 | Égalité |
| Modes de paiement | 10/10 | 6/10 | Kajabi |
| Méthodes alternatives | 10/10 | 2/10 | Kajabi |
| Checkout & conversion | 10/10 | 5/10 | Kajabi |
| Marketplace & payouts | 3/10 | 10/10 | **Écosystème** |
| Gestion transactions | 10/10 | 10/10 | Égalité |
| Abonnements | 10/10 | 0/10 | Kajabi |
| **TOTAL** | **63/70** | **43/70** | Kajabi (+20) |

---

## Recommandations Prioritaires

### Priorité 1 : Abonnements Stripe (Impact élevé)

Ajouter les abonnements récurrents permettrait :
- Revenus prévisibles (MRR)
- Accès premium à Prof Steven AI
- Membership communauté
- Plans de coaching mensuels

**Effort estimé** : 3-5 jours

### Priorité 2 : Apple Pay / Google Pay (Impact moyen)

Ces méthodes de paiement peuvent augmenter les conversions de 10-20% sur mobile.

**Effort estimé** : 1 jour (configuration Stripe)

### Priorité 3 : Order Bumps / Upsells (Impact moyen)

Augmenter le panier moyen en proposant des produits complémentaires.

**Effort estimé** : 2-3 jours

---

## Conclusion

Votre écosystème a une **architecture de paiement supérieure** pour un modèle marketplace (multi-vendeurs avec coachs), mais il lui manque les **fonctionnalités de monétisation avancées** de Kajabi (abonnements, BNPL, upsells).

Pour atteindre la parité avec Kajabi Pro sur les paiements, les priorités sont :
1. **Abonnements Stripe** (critique pour le MRR)
2. **Apple Pay / Google Pay** (quick win pour les conversions)
3. **Order bumps** (augmentation du panier moyen)

Le système de codes promo est déjà fonctionnel via Stripe Promotion Codes.
