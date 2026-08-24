# Security

## Authentication (MVP+)

- Passwords: **Argon2id** (never bcrypt/md5/sha for passwords).
- Access tokens: JWT, short-lived (15 min).
- Refresh tokens: rotation on every use; reuse detection invalidates the family.
- Transport: `HttpOnly`, `Secure`, `SameSite=Lax` cookies only — tokens never in localStorage.
- RBAC: `USER`, `ADMIN` roles; admin routes check role server-side.

## API Hardening

- Global `ValidationPipe` with whitelist + forbidNonWhitelisted.
- Rate limiting via Redis: strictest on `/auth/*` and calculator endpoints.
- CORS: allowlist of known web origins only.
- Errors: never leak stack traces or internals in production responses.

## Data

- Secrets only via environment variables; `.env` is gitignored.
- Prisma parameterizes all queries (no raw SQL string building).
- Saved-calculation JSONB payloads validated against the same DTOs as the API.

## Frontend

- No secrets in `NEXT_PUBLIC_*` variables.
- All user input validated with Zod before hitting the API.

## Reporting

Security issues: open a private security advisory — do not file public issues.
