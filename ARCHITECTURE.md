# Architecture

## System Overview

```
Users
  │
  ▼
Cloudflare / CDN / WAF
  │
  ▼
Next.js  (apps/web)          NestJS API  (apps/api)
React + TypeScript            REST /api/v1
SSR/SSG + interactive UI       │
       │                       ├── Auth
       └── fetch ─────────────►├── Users
                               ├── Calculators
                               ├── Saved Calculations
                               ├── Analytics
                               ├── Ads
                               └── Admin
                               │
                     ┌─────────┴─────────┐
                     ▼                   ▼
                PostgreSQL            Redis
```

## Key Decision: Modular Monolith First

One deployable API process with clearly bounded modules. Extract services only
when load justifies it (see ADR-0001).

## Workspace Layout (pnpm)

```
apps/web                  Next.js frontend
apps/api                  NestJS REST API
packages/calculator-engine  Pure TS calculation logic (no I/O, no framework imports)
packages/shared           Shared types/constants (DTO shapes, limits)
packages/ui               Shared React components (added when duplicated twice+)
docs/decisions            ADRs — every architectural decision lives here
infra/                    Deployment configs
```

## Dependency Rules

1. `calculator-engine` must not import from React, Next.js, NestJS, Prisma, or any I/O library. It is pure functions in / pure functions out.
2. `apps/api` may import `@calc/engine`. `apps/web` may import `@calc/engine` only for input validation helpers — **results shown to users must come from the API**.
3. `packages/shared` is imported by both apps; it must stay dependency-free.
4. No app-to-app imports (`apps/web` never imports `apps/api` code).

## Request Flow (calculators)

```
Browser form → POST /api/v1/calculators/:type → DTO validation (NestJS)
→ engine function (pure) → JSON response → React renders results
```

## Data Flow

- PostgreSQL: users, saved calculations, admin data (source of truth).
- Redis: rate limiting counters, sessions/refresh-token denylist, hot caches.
- Web: static/ISR where possible; calculator pages are SSG + client interactivity.

## Environments

| Env | Web | API | Data |
|---|---|---|---|
| Local | :3000 | :3001 | Docker Compose |
| Production | Vercel/Node behind Cloudflare | Node container | Managed PG + Redis |
