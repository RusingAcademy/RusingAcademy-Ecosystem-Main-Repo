# Sprint E3: Blockers & Known Issues

## Active Blockers

There are no active blockers preventing the completion of Sprint E3. All planned features have been implemented.

## Known Limitations

| Limitation | Impact | Mitigation |
|---|---|---|
| File upload is URL-based only | Admins must host files externally (e.g., Bunny CDN, S3) and paste the URL | Future sprint can add direct file upload via Bunny CDN or S3 integration |
| Enrollment-based access control not enforced | The `requiresEnrollment` flag is stored but not checked on the learner side | Future sprint should add enrollment verification before allowing download |
| SQL injection risk in search | The `resourceLibraryRouter.list` uses string interpolation for search queries | Should be refactored to use parameterized queries in a future hardening sprint |

## Inherited Blockers (from previous waves)

| Blocker | Source | Status |
|---|---|---|
| `OPENAI_API_KEY` needed for AI question generation | Wave C | Pending — requires environment variable configuration in Railway |
| `STRIPE_WEBHOOK_SECRET` verification in Railway | Wave C | Pending — requires Railway environment configuration |
| Seed data needed for `sle_practice_questions` table | Wave B | Pending — requires content creation |
