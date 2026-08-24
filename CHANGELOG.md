# Changelog

All notable changes documented here. Format based on Keep a Changelog;
versioning: SemVer.

## [0.1.0] — 2026-08-24

### Added
- Repository baseline per CALC-BASELINE-2026-08-21 (modular monolith).
- Canonical docs: PROJECT-BASELINE, ARCHITECTURE, API-SPEC, DATABASE-SCHEMA,
  CALCULATOR-SPEC, SECURITY, TESTING, DEPLOYMENT, AI-CODING-RULES.
- ADR-0001: approved baseline (Next.js + NestJS + PostgreSQL + Redis, en-only).
- `@calc/engine`: loan-payment, amortization, age, retirement formulas + unit tests.
- `@calc/api`: NestJS app with `/api/v1/health` and calculator endpoints,
  Prisma schema for users/saved_calculations.
- `@calc/web`: Next.js English UI with all four MVP calculators calling the API,
  two ad slots per page, GA4/GTM env-gated scripts.
- Docker Compose for PostgreSQL 18 + Redis.

### Fixed
- `@calc/engine` / `@calc/shared` now compile to `dist/` (CJS + declarations) so
  the built NestJS API can resolve them at runtime.
- `apps/api`: added `tsconfig.build.json` (excludes tests) so output lands at
  `dist/main.js`.
- `apps/api`: DTO imports in controllers must be value imports — `import type`
  erased class metadata and broke ValidationPipe whitelisting (400 on every
  request).

### Verified
- Live smoke test: `/api/v1/health`, all four calculator endpoints, DTO 400s.
- Full gate: typecheck clean across 5 workspaces; engine 16/16, api 4/4;
  web production build with SSG pages.
