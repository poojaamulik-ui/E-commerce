# Security & Data Protection Policies

## 1. Authentication & Session Security
- **Algorithm**: HS256 JWT tokens created using `jose` with mandatory 32-byte secret (`AUTH_SECRET`).
- **Cookie Security**: Flags `httpOnly: true`, `sameSite: "lax"`, and `secure: true` in production environments.
- **Password Storage**: Passwords hashed using `bcryptjs` with 12 salt rounds.

## 2. Authorization & RBAC
- Explicit role hierarchy: `CUSTOMER`, `STAFF`, `ADMIN`.
- Server-side guard helpers `requireAuth()`, `requireStaffOrAdmin()`, and `requireAdmin()` protect Route Handlers and mutations.
- Broken Object-Level Authorization (BOLA) Prevention: Customers can only query orders matching their authenticated `userId`.

## 3. Financial & Payment Integrity
- **Server Authority**: The browser is never trusted for totals, shipping costs, or discount calculations.
- **No Card Storage**: BharatBazaar stores zero payment cards, CVVs, or bank secrets on application servers.
- **HMAC Signatures**: Razorpay payments require HMAC-SHA256 signature verification before any order is marked `PAID`.
- **Webhook Idempotency**: All webhook events are logged with raw payloads in `WebhookEvent`. Duplicate event IDs are acknowledged with HTTP 200 without duplicate processing.

## 4. Input Sanitization & Attack Mitigations
- **SQL Injection**: Prevented by Prisma parameterized queries.
- **XSS**: React automatically escapes untrusted user strings in the virtual DOM.
- **File Upload Protection**: Content type limited to safe raster images (`jpeg`, `png`, `webp`, `avif`) with a 5MB size ceiling.
- **Secret Hygiene**: All private keys stored strictly in server-side environment variables without `NEXT_PUBLIC_` prefixes.
