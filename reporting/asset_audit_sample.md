# Asset Audit — 10 Sample Media Files

| # | File | Type | Size | In Manus? | CDN Equivalent | GitHub Usage | Action | Reason |
|---|------|------|------|-----------|----------------|-------------|--------|--------|
| 1 | `francine.jpg` | image | 69.6 KB | ❌ | ❌ None | No references | **ARCHIVE** | Not referenced in any code |
| 2 | `ecosystem-lingueefy.jpg` | image | 639.3 KB | ❌ | ✅ Yes | client/src/pages/EcosystemHub.tsx:332:      image: "https:// | **ARCHIVE** | Already served via CDN in Manus |
| 3 | `GC_CSC_SCC_EN_logo_20260112.png` | image | 215.8 KB | ❌ | ❌ None | client/src/components/homepage/TheyTrustedUs.tsx:30:    logo | **UPLOAD_TO_CDN** | Used in GitHub code, needs CDN upload for revival |
| 4 | `capsule_02.jpg` | image | 182.7 KB | ❌ | ✅ Yes | client/src/components/CrossEcosystemSection.tsx:73:    thumb | **ARCHIVE** | Already served via CDN in Manus |
| 5 | `preciosa-baganha-thumb.jpg` | image | 112.1 KB | ❌ | ✅ Yes | client/src/components/FeaturedCoaches.tsx:120:    thumbnailU | **ARCHIVE** | Already served via CDN in Manus |
| 6 | `stakeholder_consensus.mp3` | audio | 95.8 KB | ❌ | ❌ None | No references | **ARCHIVE** | Not referenced in any code |
| 7 | `testimonial-4.jpg` | image | 126.0 KB | ❌ | ✅ Yes | client/src/pages/EcosystemLanding.tsx:531:                   | **ARCHIVE** | Already served via CDN in Manus |
| 8 | `studio-steven-4.jpg` | image | 235.5 KB | ❌ | ❌ None | client/src/pages/BarholexMediaLanding.tsx:164:          imag | **UPLOAD_TO_CDN** | Used in GitHub code, needs CDN upload for revival |
| 9 | `rusing_academy_variant_favicon.png` | image | 984.6 KB | ❌ | ❌ None | No references | **ARCHIVE** | Not referenced in any code |
| 10 | `collaboration_thanks.mp3` | audio | 119.4 KB | ❌ | ❌ None | No references | **ARCHIVE** | Not referenced in any code |

## Summary

- **ARCHIVE**: 8 files (already on CDN or unreferenced)
- **UPLOAD_TO_CDN**: 2 files (needed for revived features)
- **KEEP**: 0 files (already in Manus)

## CDN Migration POC

The 2 files flagged for upload were successfully migrated to CDN:

| Original Local Path | CDN URL |
|---|---|
| `/images/capsules/capsule_02.jpg` | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/QKshoZVRtFFYoryF.jpg` |
| `/studio-steven-4.jpg` | `https://files.manuscdn.com/user_upload_by_module/session_file/310519663049070748/JiWCFZIWLlWkJlPP.jpg` |

When reviving pages that reference these assets (e.g., BarholexMediaLanding.tsx), the local paths should be replaced with these CDN URLs.
