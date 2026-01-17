# Sprint 3 — Règles et Protocoles

> **Document de référence obligatoire pour tous les micro-changements du Sprint 3.**  
> Dernière mise à jour : 16 janvier 2026

---

## 1. Règle des Micro-changements

Chaque modification doit respecter le principe suivant :

> **1 PR = 1 Objectif = 1 Validation Visuelle**

### Principes fondamentaux

| Principe | Description |
|----------|-------------|
| **Atomicité** | Chaque PR ne contient qu'un seul changement logique |
| **Traçabilité** | Chaque modification est documentée et vérifiable |
| **Réversibilité** | Tout changement peut être annulé sans impact collatéral |
| **Validation visuelle** | Aucun merge sans preuve visuelle de non-régression |

---

## 2. Processus de Déploiement

```
Branche feature → Push → PR → Deploy Staging → Validation Visuelle → Merge → Deploy Production
```

### Étapes détaillées

1. **Créer une branche** depuis la baseline (`hotfix/visual-rollback-5197521` ou `main`)
2. **Développer** le micro-changement unique
3. **Push** vers GitHub
4. **Créer une PR** avec description claire de l'objectif
5. **Déployer sur Staging** (automatique via Railway)
6. **Valider visuellement** (voir checklist ci-dessous)
7. **Merge** uniquement après validation complète
8. **Vérifier Production** après déploiement automatique

---

## 3. Checklist Avant Merge

### Screenshots Obligatoires

#### Desktop (minimum 4)

- [ ] **Above the fold** : Header + Hero + CTAs visibles
- [ ] **Section milieu** : Ecosystem cards ou section principale
- [ ] **Testimonials** : Section témoignages (si applicable)
- [ ] **Footer** : Footer complet avec liens légaux

#### Mobile (minimum 2)

- [ ] **Header + Hero** : Navigation mobile + section héro
- [ ] **Ecosystem cards** : Cartes en mode mobile (scroll horizontal ou vertical)

### Vérifications Techniques

- [ ] **Console clean** : Aucune erreur JavaScript critique
- [ ] **HTTP 200** : Toutes les pages principales répondent correctement
- [ ] **CTAs fonctionnels** : "Book a Diagnostic" ouvre Calendly
- [ ] **Login accessible** : Route `/login` charge correctement
- [ ] **Langue FR/EN** : Switch de langue fonctionne (si applicable)

### Lighthouse Baseline (Optionnel mais recommandé)

| Métrique | Seuil minimum |
|----------|---------------|
| Performance | > 70 |
| Accessibility | > 90 |
| Best Practices | > 80 |
| SEO | > 90 |

---

## 4. Interdictions Strictes

Les actions suivantes sont **INTERDITES** pendant le Sprint 3 :

| Interdit | Raison |
|----------|--------|
| ❌ Refactoring global | Risque de régression non contrôlée |
| ❌ Changements de thème globaux | Impact visuel imprévisible |
| ❌ Modifications non demandées | Hors périmètre = hors contrôle |
| ❌ Merge sans validation visuelle | Violation du protocole |
| ❌ Branches multiples en parallèle | Conflits et confusion |
| ❌ Modifications des variables d'environnement | Risque d'incident production |
| ❌ Changements backend/API | Sprint 3 = UI/UX uniquement |

---

## 5. Baseline Visuelle de Référence

### Commit de référence

| Élément | Valeur |
|---------|--------|
| **Commit** | `5197521` |
| **Message** | Sprint 1: Trust & Conversion Optimization |
| **Date** | 12 janvier 2026 |
| **Branche** | `hotfix/visual-rollback-5197521` |

### Pack de référence

Les screenshots de référence sont disponibles dans :

```
/docs/visual-baseline/
├── README.md
├── desktop-above-fold.png
├── desktop-ecosystem-cards.png
├── desktop-testimonials.png
├── desktop-footer.png
├── mobile-header-hero.png
└── mobile-ecosystem-cards.png
```

---

## 6. Nomenclature des Branches

Format obligatoire pour les branches Sprint 3 :

```
sprint3/micro-XXX-description-courte
```

Exemples :
- `sprint3/micro-001-guardrails`
- `sprint3/micro-002-header-gold-standard`
- `sprint3/micro-003-hub-cards-white`

---

## 7. Responsabilités

| Rôle | Responsabilité |
|------|----------------|
| **CEO** | Validation finale, feu vert pour production |
| **CPTO** | Stratégie, priorisation, contrôle qualité |
| **Lead Front-End (Manus)** | Exécution, screenshots, PR, déploiement |

---

## 8. En cas de doute

> **Si un doute existe sur un fichier ou un changement, NE PAS le modifier et le signaler immédiatement.**

La priorité est la **stabilité** et la **confiance utilisateur**, pas la vitesse.

---

*Document créé le 16 janvier 2026 — Sprint 3 Phase 0*
