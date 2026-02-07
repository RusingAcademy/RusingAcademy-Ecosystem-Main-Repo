# RusingÂcademy Learning Ecosystem — Les 21 prochaines étapes stratégiques

**Projet :** EcosystemHub Preview  
**Date :** 7 février 2026  
**État actuel :** 2 006 tâches complétées sur 2 395 (84 % d'avancement global)

---

## Contexte et état des lieux

L'écosystème RusingÂcademy a atteint un stade de maturité significatif : 109 pages frontend, 32 pages d'administration, 186 composants réutilisables, 29 routeurs serveur, 145 tables de base de données et 1 413 tests unitaires. Les fondations techniques — authentification OAuth, Stripe, progression XP, leaderboard social, notifications push, tableau de bord coach, rapports PDF, funnels marketing et automations — sont en place et fonctionnelles.

Les 389 tâches restantes ont été analysées, regroupées par thème et priorisées selon trois critères : **impact business** (conversion, rétention, revenus), **dette technique** (stabilité, maintenabilité, déploiement) et **expérience utilisateur** (parcours apprenant, crédibilité institutionnelle). Les 21 étapes ci-dessous sont ordonnées en vagues progressives, chaque vague débloquant la suivante.

---

## Vague A — Stabilisation technique et préparation au lancement (Étapes 1–5)

Ces cinq étapes éliminent les obstacles techniques qui empêchent un déploiement fiable en production. Sans elles, aucune fonctionnalité métier ne peut être livrée de manière crédible.

| # | Étape | Portée | Justification |
|---|-------|--------|---------------|
| 1 | **Résolution des erreurs TypeScript (~160)** | Corriger les erreurs de types tRPC, schéma DB et imports manquants qui font crasher le compilateur TSC. | Le build de production échoue actuellement. C'est le bloqueur n°1 pour tout déploiement. |
| 2 | **Audit d'accessibilité WCAG AA** | Contraste texte/fond sur sections sombres, focus clavier visible, hiérarchie éditoriale (Title → Lead → Content → CTA), rythme vertical normalisé. | Le public cible — fonctionnaires canadiens — exige une conformité aux normes d'accessibilité du gouvernement fédéral. |
| 3 | **Design System unifié** | Échelle typographique cohérente (H1–labels), système d'espacement 8px, boutons standardisés (primary/secondary/ghost), cartes unifiées, ombres et border-radius cohérents. | Élimine les incohérences visuelles entre les 3 marques (RusingÂcademy, Lingueefy, Barholex) et accélère le développement futur. |
| 4 | **Header statique Canada.ca + Cross-Ecosystem Section premium** | Header qui scroll away (pas sticky), section Cross-Ecosystem redesignée avant le footer sur les 3 pages principales. | Aligne l'expérience avec les conventions institutionnelles canadiennes et renforce la navigation inter-marques. |
| 5 | **Audit Lighthouse complet (Mobile + Desktop) + axe-core** | Inventaire des pages (sitemap), audit automatisé de performance, accessibilité et SEO, rapport priorisé P0/P1/P2 avec Top 10 quick wins. | Fournit une baseline mesurable avant le lancement et identifie les problèmes critiques de performance mobile. |

---

## Vague B — Parcours apprenant complet et monétisation (Étapes 6–11)

Ces six étapes construisent le parcours apprenant de bout en bout : de la découverte du curriculum jusqu'au paiement, en passant par les quiz et la progression.

| # | Étape | Portée | Justification |
|---|-------|--------|---------------|
| 6 | **Page Curriculum complète** | CurriculumPage.tsx avec vue d'ensemble des 6 Paths, navigation par onglets, modules et leçons affichés, thumbnails de cours intégrés, CTAs d'inscription connectés à Stripe. | C'est la page de conversion principale — sans elle, les visiteurs ne peuvent pas explorer l'offre pédagogique ni s'inscrire. |
| 7 | **Checkout Stripe fonctionnel** | Créer les produits et prix Stripe pour les Plans Maison, connecter les boutons "Enroll Now" et "Get Started" des Bundles au checkout, flux de paiement complet avec carte test 4242. | Pas de revenus sans checkout fonctionnel. C'est le chemin critique vers la monétisation. |
| 8 | **Système de quiz interactifs** | Table quiz_questions et quiz_attempts, composant QuizViewer.tsx, questions à choix multiples avec feedback immédiat, attribution de XP selon la performance, seed des questions pour les 6 Paths. | Les quiz sont le mécanisme principal d'évaluation formative et le moteur d'engagement qui alimente le système de progression XP. |
| 9 | **Bouton "Mark as Complete" + connexion données réelles** | Bouton de complétion sur la vue leçon, connexion du streak et des défis aux données réelles de complétion leçon/quiz. | Sans ce bouton, le système de progression XP, les streaks et les badges restent déconnectés de l'activité réelle de l'apprenant. |
| 10 | **Facturation organisationnelle (Org Billing)** | Facturation par siège pour les organisations, invoices Stripe par organisation, gestion des plans Enterprise. | Débloque le segment B2B (ministères fédéraux, agences) qui représente le marché principal de RusingÂcademy. |
| 11 | **Bundles & Learning Paths** | Regroupement de cours en parcours structurés, tarification bundle, progression inter-cours, certificats de parcours. | Augmente la valeur perçue et le panier moyen en proposant des parcours complets plutôt que des cours isolés. |

---

## Vague C — Engagement et rétention avancés (Étapes 12–16)

Ces cinq étapes transforment l'écosystème d'un simple LMS en une plateforme d'engagement continu qui fidélise les apprenants sur le long terme.

| # | Étape | Portée | Justification |
|---|-------|--------|---------------|
| 12 | **Drip Content — Calendrier de diffusion** | Déblocage progressif des leçons selon un calendrier, notifications de nouveau contenu disponible, prévention de l'abandon par surcharge. | Le drip content est le levier de rétention n°1 dans l'EdTech — il crée un rendez-vous régulier et empêche la consommation passive. |
| 13 | **Conversation Practice Mode avec audio** | Enregistrement audio en temps réel (MediaRecorder API), upload et transcription, conversation back-and-forth avec feedback IA, historique des sessions et résumé de fin. | La pratique orale est le besoin n°1 des fonctionnaires préparant le SLE. C'est le différenciateur clé de Lingueefy face aux concurrents. |
| 14 | **Défis hebdomadaires avec badges spéciaux** | Planificateur de défis côté serveur, progression connectée aux complétions leçon/quiz, notifications de défi, badges spéciaux pour les défis réussis. | Crée un cycle d'engagement récurrent (hebdomadaire) qui complète le système de streaks quotidien et maintient la motivation à moyen terme. |
| 15 | **A/B Content Testing Framework** | Comparaison de deux versions d'une leçon, répartition du trafic, mesure de performance (complétion, engagement, scores), recommandations automatiques. | Permet d'optimiser le contenu pédagogique de manière data-driven — essentiel pour améliorer continuellement les taux de réussite au SLE. |
| 16 | **Programme d'affiliation** | CRUD partenaires affiliés, suivi des référencements, calcul des commissions, demandes de paiement, page /affiliate avec code de référencement et historique. | Canal d'acquisition à coût variable — les coaches et formateurs deviennent des ambassadeurs rémunérés à la performance. |

---

## Vague D — Infrastructure de contenu et outils admin (Étapes 17–19)

Ces trois étapes renforcent les outils de gestion de contenu et d'administration pour permettre à l'équipe de RusingÂcademy d'opérer de manière autonome.

| # | Étape | Portée | Justification |
|---|-------|--------|---------------|
| 17 | **Media Library centralisée** | Bibliothèque de médias avec upload S3, lazy loading Bunny Stream pour les vidéos, gestion des thumbnails, intégration des vidéos Behaviorism et Cognitivism. | L'équipe a besoin d'un endroit centralisé pour gérer les assets visuels et vidéo sans intervention technique. |
| 18 | **Email Template Builder** | Éditeur de templates email avec variables dynamiques, prévisualisation, templates bilingues (FR/EN), intégration avec le système d'automations. | Les automations marketing sont en place mais les emails restent des templates statiques — un builder visuel permet à l'équipe marketing d'itérer sans développeur. |
| 19 | **Page de contact unifiée + gestion des leads** | Page de contact professionnelle avec formulaire validé, envoi réel des messages (email + base de données), notification à admin@rusingacademy.ca, page /dashboard/admin/leads avec filtres et statuts. | Actuellement, les demandes de contact ne sont pas traitées de manière structurée. Cette étape ferme la boucle acquisition → qualification → suivi. |

---

## Vague E — Polish final et lancement (Étapes 20–21)

Ces deux dernières étapes préparent l'écosystème pour un lancement public crédible et professionnel.

| # | Étape | Portée | Justification |
|---|-------|--------|---------------|
| 20 | **Photos réelles et contenu authentique** | Remplacer les photos placeholder (Soukaina, Preciosa, Steven — nœud papillon bleu), intégrer la photo d'Erika Seguin, corriger le cadrage des Expert Cards, fixer les boutons LinkedIn avec les vrais profils. | La crédibilité institutionnelle repose sur l'authenticité visuelle — des photos stock ou placeholder détruisent la confiance du public cible. |
| 21 | **Intégration Calendly complète** | Création de réservations via l'API Calendly (scheduling_url redirect), webhook handler pour les événements de réservation, synchronisation avec le CRM interne. | La réservation de sessions de coaching est le point d'entrée principal pour Lingueefy — sans Calendly fonctionnel, le funnel coaching est incomplet. |

---

## Synthèse par vague

| Vague | Étapes | Thème | Durée estimée |
|-------|--------|-------|---------------|
| **A** | 1–5 | Stabilisation technique | 1–2 sprints |
| **B** | 6–11 | Parcours apprenant + monétisation | 2–3 sprints |
| **C** | 12–16 | Engagement et rétention | 2–3 sprints |
| **D** | 17–19 | Infrastructure contenu + admin | 1–2 sprints |
| **E** | 20–21 | Polish final + lancement | 1 sprint |

La Vague A est non négociable avant toute mise en production. La Vague B est le chemin critique vers les premiers revenus. Les Vagues C et D peuvent être parallélisées selon les ressources disponibles. La Vague E est la dernière ligne droite avant le lancement public.
