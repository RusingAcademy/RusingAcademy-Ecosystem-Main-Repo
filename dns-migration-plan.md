# DNS Migration Plan - RusingAcademy Production to Railway

**Date:** January 11, 2026  
**Status:** Railway domains configured, DNS update required

---

## Railway Custom Domains Configured

### Domain 1: www.rusingacademy.ca (PRIMARY)
**Railway Target:** `mfb69woe.up.railway.app`  
**Status:** Cloudflare proxy detected (currently pointing to Manus)

### Domain 2: app.rusingacademy.ca (OPTIONAL)
**Railway Target:** `t3t31is1.up.railway.app`  
**Status:** Record not yet detected

---

## DNS Records to Configure

### Step 1: Update CNAME Records

| Type | Host/Name | Value (Railway Target) | TTL | Action |
|------|-----------|------------------------|-----|--------|
| CNAME | www | `mfb69woe.up.railway.app` | Auto | **UPDATE** (replace `cname.manus.space`) |
| CNAME | app | `t3t31is1.up.railway.app` | Auto | **ADD** (new record) |

### Step 2: Configure Apex Domain Redirect (rusingacademy.ca → www.rusingacademy.ca)

**Option A: If using Cloudflare (Recommended)**
1. Add a Page Rule for `rusingacademy.ca/*`
2. Set Forwarding URL (301 - Permanent Redirect) to `https://www.rusingacademy.ca/$1`

**Option B: If using standard DNS provider**
- Use registrar's URL forwarding feature
- Forward `rusingacademy.ca` → `https://www.rusingacademy.ca` (301 redirect)

**Option C: If DNS provider supports ALIAS/ANAME**
| Type | Host/Name | Value | TTL |
|------|-----------|-------|-----|
| ALIAS/ANAME | @ | `mfb69woe.up.railway.app` | Auto |

---

## Records to Remove/Update

| Current Record | Action |
|----------------|--------|
| CNAME www → cname.manus.space | **UPDATE** to `mfb69woe.up.railway.app` |
| Any A record for @ pointing to Manus IP | **REMOVE** or replace with redirect |

---

## Redirections Guaranteed by Railway

Railway automatically handles:
- ✅ `http://www.rusingacademy.ca` → `https://www.rusingacademy.ca`
- ✅ `http://app.rusingacademy.ca` → `https://app.rusingacademy.ca`
- ✅ SSL/HTTPS certificates (auto-provisioned via Let's Encrypt)

**Manual configuration required:**
- ⚠️ `http://rusingacademy.ca` → `https://www.rusingacademy.ca` (via DNS/registrar redirect)
- ⚠️ `https://rusingacademy.ca` → `https://www.rusingacademy.ca` (via DNS/registrar redirect)

---

## SSL/HTTPS Configuration

Railway automatically provisions SSL certificates via Let's Encrypt once DNS is properly configured.

**Current Status:**
- www.rusingacademy.ca: Cloudflare proxy detected (SSL via Cloudflare)
- app.rusingacademy.ca: Waiting for DNS update

---

## Verification Checklist (After DNS Update)

- [ ] https://www.rusingacademy.ca loads correctly
- [ ] http://www.rusingacademy.ca redirects to HTTPS
- [ ] https://rusingacademy.ca redirects to https://www.rusingacademy.ca
- [ ] http://rusingacademy.ca redirects to https://www.rusingacademy.ca
- [ ] https://app.rusingacademy.ca loads correctly (optional)
- [ ] SSL certificates valid (green padlock)

---

## Notes

1. **DNS Propagation:** Changes may take up to 72 hours to propagate worldwide
2. **Cloudflare Users:** If using Cloudflare proxy (orange cloud), ensure SSL mode is set to "Full" or "Full (Strict)"
3. **Testing:** Use `dig` or online DNS checkers to verify propagation before testing in browser

