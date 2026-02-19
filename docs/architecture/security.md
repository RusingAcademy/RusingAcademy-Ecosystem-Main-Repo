# RusingAcademy — Security Model

## Authentication

### JWT-based Authentication

The system uses **JSON Web Tokens (JWT)** for stateless authentication:

- Tokens are signed using the `jose` library with HS256 algorithm
- Tokens are stored in **HTTP-only, Secure, SameSite=Lax** cookies
- Token expiry: 7 days (configurable via `JWT_EXPIRY`)
- Refresh: Automatic on each authenticated request

### Session Flow

```
1. User submits credentials (email + password)
2. Server verifies against bcrypt-hashed password in DB
3. Server generates JWT with { userId, role, email }
4. JWT set as HTTP-only cookie (not accessible via JavaScript)
5. Subsequent requests include cookie automatically
6. Server middleware verifies JWT on each request
```

## Authorization (RBAC)

### Role Hierarchy

| Role | Level | Access |
|------|-------|--------|
| `superadmin` | 5 | Full system access |
| `admin` | 4 | Admin portal, user management |
| `hr_manager` | 3 | HR portal, employee management |
| `coach` | 2 | Coach portal, sessions, earnings |
| `learner` | 1 | Learner portal, courses |

### Route Protection

```typescript
// tRPC middleware enforces role-based access
const adminProcedure = protectedProcedure.use(requireRole('admin'));
const coachProcedure = protectedProcedure.use(requireRole('coach'));
const hrProcedure = protectedProcedure.use(requireRole('hr_manager'));
```

## API Security

### Helmet Configuration

The server uses `helmet` middleware with strict Content Security Policy:

- `default-src: 'self'`
- `script-src: 'self' 'unsafe-inline'` (required for React)
- `connect-src: 'self' wss:` (for WebSocket)
- `frame-src: 'none'` (no iframes)
- HSTS enabled with 1-year max-age

### Rate Limiting

- Global: 100 requests per 15 minutes per IP
- Auth endpoints: 5 attempts per 15 minutes per IP
- API endpoints: 60 requests per minute per user

### CORS

- Production: Only `https://www.rusingacademy.com`
- Staging: Staging Railway URL
- Credentials: Enabled (for cookie-based auth)

### Input Validation

All tRPC procedures use **Zod schemas** for input validation:

```typescript
.input(z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
}))
```

## Payment Security

### Stripe Webhook Verification

All Stripe webhooks verify the signature using the signing secret:

```typescript
const event = stripe.webhooks.constructEvent(
  rawBody,
  signature,
  webhookSecret
);
```

### Stripe Connect

Coach payouts use Stripe Connect with:
- Express accounts (Stripe-hosted onboarding)
- Platform-controlled payouts
- Webhook-based status synchronization

## WebSocket Security

- JWT authentication required on connection
- Users auto-joined to role-based rooms
- Message validation before broadcast
- Rate limiting on message frequency

## Known Limitations & Remediation Plan

| Issue | Severity | Status | Plan |
|-------|----------|--------|------|
| TypeScript `strict: false` | Medium | Known | Enable incrementally |
| No CSRF tokens on mutations | Medium | Known | Add CSRF middleware |
| No MFA support | Low | Planned | Phase 7+ |
| No account lockout | Medium | Known | Add after N failed attempts |

## Security Checklist

- [x] HTTPS enforced (Railway auto-SSL)
- [x] HTTP-only cookies for JWT
- [x] Helmet security headers
- [x] Rate limiting on auth endpoints
- [x] Stripe webhook signature verification
- [x] Input validation (Zod)
- [x] RBAC on all protected routes
- [x] WebSocket JWT authentication
- [ ] CSRF protection on mutations
- [ ] MFA support
- [ ] Account lockout after failed attempts
- [ ] Content Security Policy nonce-based
