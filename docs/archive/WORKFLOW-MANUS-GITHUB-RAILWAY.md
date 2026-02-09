# Workflow MANUS-GITHUB-RAILWAY

## Vue d'ensemble

Ce document décrit le workflow de développement et déploiement pour le projet RusingAcademy Ecosystem, utilisant trois environnements interconnectés : Manus (développement), GitHub (contrôle de version), et Railway (production).

## Architecture du Workflow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     MANUS       │◀───▶│     GITHUB      │────▶│    RAILWAY      │
│  (Développement)│     │ (Source Control)│     │  (Production)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │    Bidirectionnel     │                       │
   Environnement           Repository              Déploiement
   de dev sandbox      rusingacademy-ecosystem    automatique

Scripts de synchronisation:
  • sync-to-github.py   : Manus → GitHub
  • sync-from-github.py : GitHub → Manus
```

## Rôles de chaque environnement

### Manus (Développement)

Manus est l'environnement de développement principal où les modifications sont créées et testées.

| Aspect | Description |
|--------|-------------|
| **URL** | Environnement sandbox Manus |
| **Rôle** | Développement, prototypage, tests |
| **Base de données** | TiDB Cloud (environnement de dev) |
| **Stockage** | Bunny CDN pour les assets |
| **Avantages** | Preview en temps réel, outils intégrés, rollback facile |

### GitHub (Contrôle de version)

GitHub sert de source unique de vérité pour le code.

| Aspect | Description |
|--------|-------------|
| **Repository** | `RusingAcademy/rusingacademy-ecosystem` |
| **Branche principale** | `main` |
| **Rôle** | Versioning, historique, collaboration |
| **Intégration** | Webhook vers Railway pour déploiement automatique |

### Railway (Production)

Railway héberge l'application en production avec déploiement automatique.

| Aspect | Description |
|--------|-------------|
| **Service** | `rusingacademy-ecosystem` |
| **Domaine** | `app.rusingacademy.ca` |
| **Déclencheur** | Push sur branche `main` de GitHub |
| **Build** | Automatique via Nixpacks |

## Flux de travail recommandé

### 1. Développement dans Manus

Le développement se fait principalement dans Manus pour bénéficier de :
- Preview en temps réel
- Outils de débogage intégrés
- Rollback via checkpoints
- Tests visuels immédiats

### 2. Synchronisation vers GitHub

Une fois les modifications validées dans Manus, utilisez le script de synchronisation automatisé :

#### Option A : Script Python (recommandé)

```bash
# Synchronisation avec message personnalisé
python3 scripts/sync-to-github.py -m "Description des modifications"

# Mode dry-run (voir les changements sans les appliquer)
python3 scripts/sync-to-github.py --dry-run

# Synchronisation sans confirmation
python3 scripts/sync-to-github.py --force -m "Hotfix: correction urgente"
```

#### Option B : Script Bash

```bash
# Synchronisation avec message personnalisé
./scripts/sync-to-github.sh "Description des modifications"

# Synchronisation avec message auto-généré
./scripts/sync-to-github.sh
```

#### Fonctionnalités des scripts

| Fonctionnalité | Description |
|----------------|-------------|
| **Clone temporaire** | Clone le repo GitHub dans un dossier temporaire |
| **Exclusions automatiques** | Ignore node_modules, .env, logs, etc. |
| **Détection de changements** | Ne pousse que s'il y a des modifications |
| **Résumé des changements** | Affiche les fichiers modifiés avant le push |
| **Nettoyage automatique** | Supprime le dossier temporaire après le push |

### 3. Synchronisation depuis GitHub (GitHub → Manus)

Si des modifications ont été faites directement sur GitHub (par un autre développeur ou via l'interface web), vous pouvez les synchroniser vers Manus :

#### Option A : Script Python (recommandé)

```bash
# Voir les modifications sans les appliquer
python3 scripts/sync-from-github.py --dry-run

# Synchroniser avec sauvegarde
python3 scripts/sync-from-github.py --backup

# Forcer la synchronisation (écrase les modifications locales)
python3 scripts/sync-from-github.py --force
```

#### Option B : Script Bash

```bash
# Mode dry-run
./scripts/sync-from-github.sh --dry-run

# Synchronisation avec sauvegarde
./scripts/sync-from-github.sh --backup

# Forcer la synchronisation
./scripts/sync-from-github.sh --force
```

#### Fonctionnalités des scripts

| Fonctionnalité | Description |
|----------------|-------------|
| **Détection automatique** | Compare les commits locaux et distants |
| **Mode dry-run** | Prévisualise les changements sans les appliquer |
| **Sauvegarde** | Crée une copie de sécurité avant la fusion |
| **Gestion des conflits** | Signale les conflits pour résolution manuelle |
| **Rappels automatiques** | Indique si pnpm install ou db:push sont nécessaires |

### 4. Déploiement automatique sur Railway

Après le push vers GitHub :
1. Railway détecte automatiquement le nouveau commit
2. Un nouveau build est déclenché
3. L'application est déployée sur `app.rusingacademy.ca`
4. Temps de build typique : 2-5 minutes

## Gestion des conflits

### Stratégie de résolution

Lorsque des modifications existent des deux côtés (Manus et GitHub) :

1. **Identifier les différences** : Comparer les fichiers modifiés
2. **Prioriser les corrections récentes** : Les corrections de bugs et améliorations récentes ont priorité
3. **Fusion intelligente** : Conserver les fonctionnalités des deux côtés
4. **Validation** : Tester sur Manus avant de pousser vers GitHub

### Commandes utiles

```bash
# Voir les différences entre Manus et GitHub
diff -rq /home/ubuntu/ecosystemhub-preview/client/src /home/ubuntu/github-temp/client/src

# Fusionner avec conservation des deux versions
git merge --no-commit --no-ff feature-branch
```

## Migration CDN (Bunny)

Les images statiques sont hébergées sur Bunny CDN pour :
- Réduire la taille du repository (602 MB économisés)
- Accélérer les temps de build
- Améliorer les performances de chargement

### Configuration CDN

| Paramètre | Valeur |
|-----------|--------|
| **Storage Zone** | `rusingacademy-uploads` |
| **CDN URL** | `https://rusingacademy-cdn.b-cdn.net` |
| **Hostname** | `ny.storage.bunnycdn.com` |

### Références d'images

Toutes les références d'images dans le code utilisent maintenant le CDN :

```tsx
// Avant
src="/images/logos/rusingacademy-logo.png"

// Après
src="https://rusingacademy-cdn.b-cdn.net/images/logos/rusingacademy-logo.png"
```

## Bonnes pratiques

### Avant chaque session de développement

1. Vérifier l'état du déploiement Railway
2. Synchroniser le code GitHub vers Manus si nécessaire
3. Créer un checkpoint Manus avant les modifications majeures

### Après chaque session de développement

1. Tester les modifications dans Manus
2. Créer un checkpoint Manus
3. Synchroniser vers GitHub
4. Vérifier le déploiement Railway

### Gestion des secrets

| Secret | Emplacement |
|--------|-------------|
| Variables d'environnement | Railway Dashboard > Settings > Variables |
| Clés API | Manus Settings > Secrets |
| Credentials Bunny | Bunny Dashboard > Storage > FTP & API |

## Dépannage

### Le déploiement Railway échoue

1. Vérifier les logs de build dans Railway
2. S'assurer que toutes les dépendances sont dans `package.json`
3. Vérifier les variables d'environnement

### Les images ne s'affichent pas

1. Vérifier que l'image existe sur Bunny CDN
2. Vérifier l'URL CDN dans le code
3. Tester l'accès direct à l'image via curl

### Conflit de synchronisation

1. Identifier les fichiers en conflit
2. Comparer les versions
3. Fusionner manuellement en conservant les corrections récentes
4. Tester avant de pousser

## Contacts et ressources

- **GitHub Repository** : https://github.com/RusingAcademy/rusingacademy-ecosystem
- **Railway Dashboard** : https://railway.com/project/19f72c1e-d6da-4ada-b2c9-af208cfe1797
- **Bunny Dashboard** : https://dash.bunny.net/storage/1351728
- **Production URL** : https://app.rusingacademy.ca
