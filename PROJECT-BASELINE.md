# Project Baseline

```yaml
baseline:
  id: CALC-BASELINE-2026-08-21
  status: approved
  language: en-only
  architecture: modular-monolith
  frontend: nextjs
  backend: nestjs
  database: postgresql
  cache: redis
  tag: baseline-2026-08-21
```

Approval date: 2026-08-21

## 1. Project Scope

**English-only Multi-Tool Calculator Platform** — a scalable web platform
offering financial and personal calculators, with user accounts, saved
calculations, a dashboard, an admin panel, analytics, advertising, and SEO.

## 2. Objectives

1. Ship a fast, SEO-first calculator website.
2. Prove the full request path: Web → API → Calculator Engine.
3. Keep operational complexity minimal (modular monolith, no Kubernetes).

## 3. MVP Scope

Calculators:

1. Loan Monthly Payment Calculator
2. Loan Amortization Calculator
3. Age Calculator
4. Retirement Calculator

Platform:

- User registration / login / logout with secure authentication
- Saved calculations per user
- User dashboard
- Basic admin dashboard
- REST API (`/api/v1`)
- PostgreSQL persistence + Redis
- Responsive UI, WCAG 2.2 AA target
- GA4 + Google Tag Manager
- Two ad slots per calculator page
- SEO fundamentals (SSR/SSG, metadata, sitemap)
- Monitoring/logging, CI/CD, automated testing

## 4. Approved Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, Radix UI, React Hook Form, Zod, TanStack Query, Recharts |
| Backend | NestJS, TypeScript, Prisma, REST, OpenAPI |
| Data | PostgreSQL 18, Redis |
| Security | Argon2id, JWT (short-lived access + refresh rotation), HttpOnly cookies, RBAC, rate limiting |
| Testing | Vitest, Supertest, Playwright |
| Operations | Docker, GitHub Actions, Cloudflare, Sentry, Prometheus/Grafana |
| Analytics | GA4, Google Tag Manager |
| Ads | Google AdSense initially; Google Ad Manager later |

## 5. Architecture

Modular Monolith first. Do **not** start with Kubernetes/Kafka/microservices.
Calculator business logic lives in `packages/calculator-engine`, independent
from React and NestJS. See `ARCHITECTURE.md`.

## 6. Language Policy

**English only.** No Arabic UI, no i18n, no locale routing, no RTL,
no translation files in the product. Legal pages are English.

## 7. SEO Structure

```
/
/calculators/
/calculators/loan-payment/
/calculators/loan-amortization/
/calculators/age/
/calculators/retirement/
/login/  /register/  /dashboard/
/about/  /contact/
/terms/  /privacy/  /sitemap/
```

## 8. Data-Source Rule

Calculator.net may be used only for conceptual/UX inspiration. Never copy its
text, UI, code, proprietary explanations, examples, graphics, or site
structure verbatim. Formulas must be independently derived, documented in
`CALCULATOR-SPEC.md`, and tested.

## 9. Success Criteria

- `GET /api/v1/health` → `{ "status": "ok", "version": "1.0.0" }`
- All four calculators work through Web → API → Engine
- Engine unit tests pass; web builds clean
- Lighthouse SEO ≥ 90 on calculator pages

## 10. Out of Scope (MVP)

- Microservices extraction, Kubernetes, Kafka
- i18n / multilingual content
- Premium accounts / payments
- Mobile native apps

## 11. Change Control

Any deviation from this baseline requires a new ADR in
`docs/decisions/` **before** implementation. AI agents must never silently
change an approved decision (see `AI-CODING-RULES.md`).
