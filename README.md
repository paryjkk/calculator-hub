# Calculator Hub

Bilingual (English / العربية) multi-tool calculator platform — 54 calculators,
SEO-first, built as a modular monolith: Next.js frontend, NestJS REST API,
pure TypeScript calculator engine.

**Start here:** [`PROJECT-BASELINE.md`](./PROJECT-BASELINE.md) is the single
source of truth. Architecture details in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Quick Start

Prerequisites: Node.js 22 LTS, pnpm, Docker.

```bash
pnpm install
docker compose up -d          # PostgreSQL 18 + Redis
cp .env.example .env          # then fill secrets
pnpm --filter @calc/api prisma migrate dev   # once DB exists
pnpm dev                      # web http://localhost:3000 · api http://localhost:3001
```

Verify the minimal path:

```bash
curl http://localhost:3001/api/v1/health
# {"status":"ok","version":"1.0.0"}

curl -X POST http://localhost:3001/api/v1/calculators/mortgage/compute \
  -H "Content-Type: application/json" \
  -d '{"homePrice":500000,"downPayment":100000,"annualRatePct":6.5,"years":30}'
```

## Calculators (54)

| Category | Count | Examples |
|---|---|---|
| 💰 Financial | 14 | mortgage, compound interest, VAT, discount, tip, ROI/CAGR, credit-card payoff |
| 🏥 Health & Fitness | 10 | BMI, BMR, TDEE, body fat (Navy), ideal weight, due date, ovulation, pace |
| 🔢 Math | 12 | percentage, fractions, GCD/LCM, primes, quadratic solver, statistics |
| 📐 Unit Conversion | 8 | length, weight, area, volume, speed, data storage, time, temperature |
| 📅 Date & Time | 6 | age, date difference, add/subtract days, work hours, ISO week |
| 🛠️ Utilities | 4 | password generator, UUID v4, dice roller, random picker, Base64 |

## Architecture: registry-driven

Every calculator is data + a pure function:

- **Definition** (`packages/shared/src/defs/*`) — slug, category, bilingual
  labels, input fields with bounds, result formatting hints. One source shared
  by web and API.
- **Engine** (`packages/calculator-engine`) — pure functions registered in a
  slug → runner map (`registry.ts`). No I/O, no clock, no randomness inside;
  seeded PRNG where determinism is possible.
- **Generic API** — `POST /api/v1/calculators/:slug/compute` validates the
  payload against the definition (`validateInput`) and dispatches to the
  runner. Adding a calculator requires zero new endpoints or forms.
- **Generic form** (`apps/web/components/GenericCalculatorForm.tsx`) renders
  any definition client-side, including localized results and schedule tables.

Legacy typed endpoints (`POST /calculators/loan-payment`, …) remain available.

## i18n

- `/en/**` and `/ar/**` routes; middleware redirects `/` using Accept-Language.
- Full RTL for Arabic; localized UI chrome via `apps/web/lib/i18n.ts`.
- Every definition carries `en`/`ar` strings for titles, fields, units,
  results and error codes.

## Workspaces

| Path | Package | Purpose |
|---|---|---|
| `apps/web` | `@calc/web` | Next.js UI (SEO, responsive) |
| `apps/api` | `@calc/api` | NestJS REST API `/api/v1` |
| `packages/calculator-engine` | `@calc/engine` | Pure calculation logic + registry |
| `packages/shared` | `@calc/shared` | Definitions, types, validation, unit tables |

## Commands

```bash
pnpm dev / build / test / lint / typecheck
```

## Docs Map

Baseline hierarchy: `PROJECT-BASELINE.md → ARCHITECTURE.md → API-SPEC.md →
DATABASE-SCHEMA.md → CALCULATOR-SPEC.md`. Decisions live in
`docs/decisions/`.
