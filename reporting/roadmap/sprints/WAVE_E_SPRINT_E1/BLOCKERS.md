# Sprint E1 — Blockers

## No Blockers

All Sprint E1 deliverables were completed without blockers. The existing `learningPaths` schema was sufficient for full CRUD operations.

## Future Considerations
1. **Stripe Integration**: When paths are sold as products, a Stripe Price/Product needs to be created for each paid path. Currently, pricing is stored in the DB but not synced to Stripe.
2. **Path Enrollment Flow**: The public-facing path enrollment flow should be verified to work with the admin-created paths.
3. **Module Ordering**: The current implementation stores modules as a JSON array. A future sprint could add drag-and-drop reordering in the UI.
