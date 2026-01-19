# RusingÂcademy Learning Ecosystem

## 🎯 Vision

RusingÂcademy is a premium, integrated learning ecosystem dedicated to bilingual excellence and professional language development, with a primary focus on Canadian public servants and professionals.

## 🏗️ Architecture

The ecosystem brings together three complementary pillars:

| Pillar | Role | Focus |
|--------|------|-------|
| **RusingÂcademy** | Core academic and training pillar | Structured programs, assessments, exam-oriented pathways |
| **Lingueefy** | Human and AI coaching layer | Personalized practice, feedback, progression |
| **Barholex Media** | EdTech, consulting, innovation arm | Content strategy, digital infrastructure, pedagogical design |

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js / Express
- **Deployment**: Railway (PROD + STAGING)
- **AI Voice**: MiniMax API (4 Voice Coaches)
- **Version Control**: GitHub

## 🌐 Domains

| Environment | URL | Status |
|-------------|-----|--------|
| Production | https://www.rusingacademy.ca | ✅ Active |
| Staging | https://rusingacademy-ecosystem-staging-production.up.railway.app | ✅ Active |

---

## ⚠️ GOLDEN UI PAGE 13 - BASE IMMUABLE

> **CRITICAL**: The "Page 13" Golden UI design is the **immutable source of truth** for the homepage.
> 
> **Tag**: `prod-golden-page13-v2` (commit `b787144`)
> 
> **DO NOT MODIFY** the following components without explicit validation:
> - `EcosystemHeader.tsx` - Institutional header with 3 Hub Cards
> - `EcosystemHome.tsx` - Hero section with exact text
> - `SLEAICompanionWidgetMultiCoach.tsx` - Voice widget with 4 coaches

### Golden UI Components

| Component | Description | Status |
|-----------|-------------|--------|
| **Header** | Glassmorphism effect, 3 Hub Cards (RusingAcademy, Lingueefy, Barholex Media) | 🔒 Locked |
| **Hero** | FR: "CHOISISSEZ VOTRE PARCOURS" / "Vers l'Excellence Bilingue" | 🔒 Locked |
| **Hero** | EN: "CHOOSE YOUR PATH" / "To Bilingual Excellence" | 🔒 Locked |
| **Widget** | SLE AI Companion with 4 voice coaches (96px, violet glow, cyan label) | 🔒 Locked |

### Voice Coaches (MiniMax Voice IDs)

| Coach | Voice ID | Role |
|-------|----------|------|
| Prof. Steven | `Wise_Woman` | Academic guidance |
| Coach Sue-Anne | `Friendly_Person` | Conversational practice |
| Coach Erica | `Inspirational_girl` | Motivation & encouragement |
| Coach Preciosa | `Cute_Girl` | Beginner-friendly support |

---

## 🧪 Smoke Test Checklist

Before any production deployment, verify the following in **private/incognito mode**:

### Header
- [ ] Institutional title "RusingÂcademy" visible
- [ ] 3 Hub Cards displayed (RusingAcademy, Lingueefy, Barholex Media)
- [ ] Glassmorphism effect active
- [ ] No "Explore | Community | Contact" ribbon

### Hero Section
- [ ] FR: "CHOISISSEZ VOTRE PARCOURS" + "Vers l'Excellence Bilingue"
- [ ] EN: "CHOOSE YOUR PATH" + "To Bilingual Excellence"
- [ ] Language toggle functional

### SLE AI Companion Widget
- [ ] Widget visible in bottom-right corner
- [ ] 96px size with violet glow
- [ ] Cyan "Compagnon SLE" label
- [ ] **Widget rotation test**: Click through all 4 coaches
  - [ ] Prof. Steven accessible
  - [ ] Coach Sue-Anne accessible
  - [ ] Coach Erica accessible
  - [ ] Coach Preciosa accessible
- [ ] Voice synthesis functional (MiniMax API)

---

## 📋 Development Protocol

### Staging-First Mandatory

1. All changes must be deployed to **staging first**
2. Provide staging link + **3 screenshots** (Header/Hero/Widget)
3. Wait for explicit user validation before PROD deployment

### PR Guidelines

- Small, focused PRs with clear documentation
- Reference Golden UI tag when modifying homepage
- Include smoke test results in PR description

### Branch Naming

```
feature/[feature-name]
fix/[bug-description]
hotfix/[critical-fix]
sprint[N]/[task-name]
```

---

## 📚 Reference Documents

- `GUIDE_DE_CONSTRUCTION_ECOSYSTEME_RUSINGACADEMY.md.pdf` - Construction guide
- `Page_13_Widget_Design_Patch.pdf` - Widget specifications
- `Page 13.png` - Visual reference for Golden UI

---

## 📝 Sprint History

### Sprint 3 - COMPLETED ✅ (Jan 2026)

**Objective**: Restore and lock "Page 13" Golden UI design

**Achievements**:
- ✅ Restored exact Page 13 Hero text (FR/EN)
- ✅ Removed unwanted "Explore | Community | Contact" ribbon
- ✅ Preserved SLE AI Companion widget with 4 voice coaches
- ✅ Cleaned up duplicate files (EcosystemLanding.tsx removed)
- ✅ Created immutable tag `prod-golden-page13-v2`
- ✅ SHA256 verification completed (PROD = STAGING)

**Golden Reference**: Tag `prod-golden-page13-v2` (commit `b787144`)

---

## 🚀 Next Steps

- [ ] Home Page Section 2: Value Proposition (Issue #29)
- [ ] Home Page Section 3: Programs Overview
- [ ] Home Page Section 4: Testimonials
- [ ] Home Page Section 5: Call to Action

---

## 📞 Support

For questions or issues, contact the RusingÂcademy development team.

---

*Built with ❤️ for bilingual excellence*
