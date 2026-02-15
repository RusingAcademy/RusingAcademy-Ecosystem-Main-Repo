# Sprint E1 — Implementation Details

## Files Created
| File | Purpose |
|------|---------|
| `server/routers/adminPaths.ts` | Full CRUD router for learning paths (6 endpoints) |
| `client/src/pages/admin/LearningPathBuilder.tsx` | Admin Learning Path Builder page |

## Files Modified
| File | Change |
|------|--------|
| `server/routers.ts` | Import + register `adminPaths` router |
| `client/src/pages/admin/index.ts` | Export `LearningPathBuilder` |
| `client/src/pages/AdminControlCenter.tsx` | Import + section mapping for `learning-paths` |
| `client/src/App.tsx` | Route `/admin/learning-paths` |
| `client/src/components/AdminLayout.tsx` | Sidebar nav item + `Layers` icon import |

## Backend Endpoints (adminPaths.*)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `list` | query | List all paths with module count, enrollment count |
| `getById` | query | Get single path by ID with full details |
| `create` | mutation | Create path with bilingual fields, pricing, modules |
| `update` | mutation | Update path fields and modules |
| `delete` | mutation | Soft delete (archive) a path |
| `togglePublish` | mutation | Toggle draft/published status |

## Frontend Features
- Path list with status badges (draft/published/archived)
- Create/edit dialog with bilingual title, description, slug
- Pricing configuration (free or paid with CAD amount)
- Course module management (add/remove courses from path)
- Publish/unpublish toggle
- Delete with confirmation
- Empty state for zero paths

## Database Impact
- **Zero migrations** — uses existing `learningPaths` table
- Reads from `courses` table for module selection
- Reads from `enrollments` table for enrollment counts
