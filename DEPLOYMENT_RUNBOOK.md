# RusingAcademy Ecosystem - Deployment Runbook

**Version:** 1.0  
**Date:** 11 Janvier 2026  
**Production URL:** https://www.rusingacademy.ca

---

## Pipeline de Déploiement

```
Local Dev → GitHub (railway-deployment branch) → Railway (auto-deploy) → Production
```

---

## 5 Étapes de Déploiement

### Étape 1: Développement Local

```bash
# Cloner le repository
git clone https://github.com/anthropics/rusingacademy-ecosystem.git
cd rusingacademy-ecosystem

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

**Vérifications:**
- [ ] Le serveur démarre sans erreur sur http://localhost:3000
- [ ] Les pages principales chargent correctement
- [ ] Les fonctionnalités modifiées fonctionnent

### Étape 2: Commit et Push vers GitHub

```bash
# Vérifier les changements
git status
git diff

# Ajouter et committer
git add .
git commit -m "feat: description claire du changement"

# Pousser vers la branche railway-deployment
git push origin railway-deployment
```

**Convention de commit:**
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `style:` changements visuels/CSS
- `docs:` documentation
- `refactor:` refactoring sans changement fonctionnel

### Étape 3: Vérification du Build Railway

1. Aller sur [Railway Dashboard](https://railway.com/project/19f72c1e-d6da-4ada-b2c9-af208cfe1797)
2. Vérifier que le build démarre automatiquement
3. Surveiller les logs de build pour détecter les erreurs
4. Attendre que le statut passe à "Active"

**Temps de build typique:** 3-5 minutes

### Étape 4: Vérification Post-Déploiement

Exécuter la checklist ci-dessous immédiatement après le déploiement.

### Étape 5: Validation Finale

- Tester manuellement les fonctionnalités modifiées
- Vérifier les logs Railway pour détecter les erreurs runtime
- Confirmer que les redirections fonctionnent toujours

---

## Checklist Post-Déploiement

### Pages Critiques (HTTPS)

| Page | URL | Attendu |
|------|-----|---------|
| Home | https://www.rusingacademy.ca | 200 OK |
| Login | https://www.rusingacademy.ca/login | 200 OK |
| Signup | https://www.rusingacademy.ca/signup | 200 OK |
| Courses | https://www.rusingacademy.ca/courses | 200 OK |
| Lingueefy | https://www.rusingacademy.ca/lingueefy | 200 OK |
| Barholex | https://www.rusingacademy.ca/barholex-media | 200 OK |

### Redirections (301)

| Source | Destination | Attendu |
|--------|-------------|---------|
| http://rusingacademy.ca | https://www.rusingacademy.ca | 301 |
| http://www.rusingacademy.ca | https://www.rusingacademy.ca | 301 |
| rusingacademy.com | www.rusingacademy.ca | 301 |
| lingueefy.ca | www.rusingacademy.ca/lingueefy | 301 |
| lingueefy.com | www.rusingacademy.ca/lingueefy | 301 |
| barholex.ca | www.rusingacademy.ca/barholex-media | 301 |
| barholex.com | www.rusingacademy.ca/barholex-media | 301 |

### Fonctionnalités Clés

- [ ] **Auth:** Login/Signup fonctionnent (email/password)
- [ ] **Courses:** Liste des cours visible
- [ ] **Course Detail:** Pages de cours individuelles chargent
- [ ] **Language:** Switcher FR/EN fonctionne
- [ ] **SSL:** Cadenas vert sur toutes les pages
- [ ] **Console:** Pas d'erreurs JavaScript critiques

### API Backend

```bash
# Test health endpoint
curl -s https://www.rusingacademy.ca/api/health

# Test courses endpoint
curl -s https://www.rusingacademy.ca/api/courses
```

---

## Variables d'Environnement Railway

| Variable | Description | Sensible |
|----------|-------------|----------|
| `DATABASE_URL` | URL de connexion TiDB | ✅ |
| `JWT_SECRET` | Secret pour tokens JWT | ✅ |
| `STRIPE_SECRET_KEY` | Clé API Stripe | ✅ |
| `SMTP_HOST` | Serveur SMTP | ❌ |
| `SMTP_USER` | Utilisateur SMTP | ✅ |
| `SMTP_PASS` | Mot de passe SMTP | ✅ |
| `VITE_APP_URL` | URL de production | ❌ |
| `VITE_OAUTH_ENABLED` | OAuth activé (false) | ❌ |

**Important:** Ne jamais committer les valeurs sensibles dans le code.

---

## Rollback d'Urgence

Si un déploiement cause des problèmes critiques:

1. **Railway Dashboard** → Service → Deployments
2. Trouver le dernier déploiement stable
3. Cliquer sur "..." → "Rollback to this deployment"
4. Confirmer le rollback

**Temps de rollback:** ~1 minute

---

## Contacts et Ressources

| Ressource | Lien |
|-----------|------|
| Railway Dashboard | https://railway.com/project/19f72c1e-d6da-4ada-b2c9-af208cfe1797 |
| GitHub Repository | https://github.com/anthropics/rusingacademy-ecosystem |
| GoDaddy DNS | https://dcc.godaddy.com/manage/rusingacademy.ca/dns |
| TiDB Console | https://tidbcloud.com |

---

## Script de Test Automatique

```bash
#!/bin/bash
# post-deploy-test.sh

echo "=== Post-Deploy Verification ==="

# Test main pages
for url in \
  "https://www.rusingacademy.ca" \
  "https://www.rusingacademy.ca/login" \
  "https://www.rusingacademy.ca/courses" \
  "https://www.rusingacademy.ca/lingueefy" \
  "https://www.rusingacademy.ca/barholex-media"
do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$status" = "200" ]; then
    echo "✅ $url - $status"
  else
    echo "❌ $url - $status"
  fi
done

echo ""
echo "=== Redirect Tests ==="

for domain in rusingacademy.com lingueefy.ca lingueefy.com barholex.ca barholex.com
do
  status=$(curl -sI -o /dev/null -w "%{http_code}" "http://$domain")
  if [ "$status" = "301" ]; then
    echo "✅ $domain - 301 redirect"
  else
    echo "⚠️ $domain - $status (expected 301)"
  fi
done

echo ""
echo "=== Done ==="
```

---

*Document maintenu par l'équipe RusingAcademy*
