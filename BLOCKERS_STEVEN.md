# BLOCKERS_STEVEN.md - Homepage Premium Upgrade

This document logs manual steps, credentials, or external configurations required to finalize the homepage premium upgrade.

## 1. Domain & DNS Verification
- **Status:** PENDING
- **Requirement:** Ensure that the production domain `rusingacademy.ca` is correctly serving the latest build from the Railway/Vercel deployment.
- **Action for Steven:** Verify that the homepage at `https://www.rusingacademy.ca` shows the new "Choose Your Path" premium hero after merging the PR.

## 2. Media Assets (High Priority)
- **Status:** PENDING
- **Requirement:** Replace placeholder Unsplash images with official RusingAcademy / Lingueefy brand photography.
- **Action for Steven:**
    1. Upload official hero background to a CDN (or provide file for repo).
    2. Upload official logos for the "Trust Bar" (Government of Canada, etc.) if specific high-res versions are required.
    3. Current placeholders:
        - Hero: Professional Learning (Unsplash)
        - Story: Collaborative Learning (Unsplash)
        - Personas: Professional Office (Unsplash)

## 3. SEO Metadata & Social Sharing
- **Status:** IMPLEMENTED (Generic)
- **Requirement:** Finalize the OpenGraph (OG) image for the homepage.
- **Action for Steven:** Provide a 1200x630px premium image that represents the whole ecosystem for social sharing.

## 4. Final Copy Review
- **Status:** IMPLEMENTED (Bilingual)
- **Requirement:** Review the "Microcopy" for B2G/B2B credibility.
- **Action for Steven:** Review the bilingual text in `client/src/pages/EcosystemHome.tsx` and the new components in `client/src/components/homepage/` for tone and accuracy.

---
*Note: I have proceeded with high-quality placeholders to ensure the layout and UX are fully functional. These can be swapped in minutes once assets are provided.*
