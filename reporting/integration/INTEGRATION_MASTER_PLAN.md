# Integration Master Plan: RusingAcademy Multi-Repo Fusion

**Objective:** To orchestrate the fusion of 6 distinct repositories into the single, production-ready `RusingAcademy-Ecosystem-Main-Repo`, establishing it as the sole source of truth for the entire RusingAcademy ecosystem.

**Guiding Principle:** Zéro Régression. All existing features, routes, and data schemas must be preserved or gracefully migrated with full backward compatibility.

---

## 1. Repository Roles & Integration Strategy

| # | Repository | Role | Integration Strategy |
|---|---|---|---|
| 1 | **Ecosystem-Main-Repo** | **Source of Truth** | The final target. All other repos will be merged into this one. |
| 2 | **Learner-Portal** | Core FSL/ESL Courses | To be integrated as the primary learning management system (LMS) under `/courses`. |
| 3 | **Library** | Product Catalogue | To be merged as a cross-system product library at `/library`. |
| 4 | **Sales** | Accounting & Revenue | To become the backend for sales analytics, integrated with existing Stripe setup. |
| 5 | **KAJABI-style-Admin** | **Admin UI/UX Reference** | Will serve as the structural and aesthetic blueprint for the main repo's Admin Control Center. |
| 6 | **Community** | Community Forum | To be integrated as the core of all community features under `/community`. |

---

## 2. Integration Waves (Execution Order)

The integration will proceed in five distinct, sequential waves, each delivered as a separate Pull Request.

| Wave | Title | Rationale |
|---|---|---|
| **1** | **Admin Polish & Structure** | Provides immediate, high-impact visual improvement to the admin dashboard with low risk of data corruption. Establishes a stable UI container for subsequent feature integrations. |
| **2** | **Learner Portal Integration** | Integrates the core value proposition: the FSL/ESL courses. This is a complex wave involving schema and route merging. |
| **3** | **Community Integration** | A self-contained module that logically follows the user and course setup. |
| **4** | **Sales & Accounting** | Connects the product and user data to revenue analytics. Depends on the course and user structures being in place. |
| **5** | **Library & Cross-System Catalogue** | The final wave, creating a unified catalogue that ties together courses, products, and lead magnets from all other integrated parts. |

---

## 3. Risk Assessment & Mitigation

| Risk | Level | Mitigation Strategy |
|---|---|---|
| **Database Schema Conflicts** | **High** | The `Ecosystem-Main-Repo` schema will be the **base schema**. All other schemas will be carefully migrated into it using Drizzle Kit to generate and apply non-destructive migration scripts. No data will be dropped. |
| **Route Conflicts & Overlaps** | **Medium** | A comprehensive `ROUTE_MAP.md` has been created. A system of redirects, aliased routes, and careful merging of `App.tsx` will be used to ensure no routes are lost. |
| **UI/UX Inconsistency** | **Medium** | The `KAJABI-style-Admin` repo will be the **UI/UX Golden Standard** for the `/admin` section. The `Learner-Portal` will be the standard for `/courses`. A `UI_UX_BASELINE.md` has been established to guide harmonization. |
| **Component Duplication** | **Low** | All repositories use `shadcn/ui`. We will standardize on the components and theme from the `Ecosystem-Main-Repo` and deprecate duplicates. This is a non-blocking cleanup task. |

---

## 4. Key Architectural Decisions

- **Database:** `Ecosystem-Main-Repo` is the master schema. All others will be migrated into it.
- **Authentication:** The existing Clerk.dev integration in `Ecosystem-Main-Repo` will serve as the single, authoritative authentication system for the entire platform.
- **Admin UI:** The `KAJABI-style-Admin` repo provides the navigation structure and layout. The actual functionality and data will come from the `Ecosystem-Main-Repo`'s existing admin pages.
- **File Structure:** The `client/`, `server/`, and `shared/` structure of the `Ecosystem-Main-Repo` will be maintained. Code from other repos will be refactored to fit this structure.

## 5. Git & PR Strategy

- A dedicated branch will be created for each integration wave (e.g., `feat/orchestrator-wave1-admin`).
- Each wave will result in a separate Pull Request into the `main` branch of `RusingAcademy-Ecosystem-Main-Repo`.
- No direct pushes to `main` will be made.
