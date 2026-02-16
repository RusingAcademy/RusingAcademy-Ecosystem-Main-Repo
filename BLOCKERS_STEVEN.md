# BLOCKERS_STEVEN.md — Items Requiring Steven's Action

## Active Blockers

### 1. Custom Domain CORS Configuration (CRITICAL)
**Status:** Blocking production validation on www.rusing.academy  
**Issue:** The Manus platform's security layer blocks `Origin: https://www.rusing.academy`, causing all JS module scripts to return HTTP 500. Only `https://www.rusingacademy.ca` is registered as an allowed origin.  
**Action Required:** Register `www.rusing.academy` as an allowed custom domain in the Manus platform deployment settings.  
**Impact:** All beautification waves can be validated on the Railway URL, but final production validation on the custom domain is blocked until this is resolved.

### 2. Domain References Update
**Status:** Deferred — will be addressed after CORS fix  
**Issue:** ~15+ hardcoded references to `www.rusingacademy.ca` in the codebase (email templates, Stripe URLs, CRM notifications, auth flows).  
**Action Required:** Confirm whether all references should be updated to `www.rusing.academy`.

---

## Resolved Blockers

(None yet)

---

*Last updated: February 16, 2026 — Wave 1*
