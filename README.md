# Calculator Hub

English-only Multi-Tool Calculator Platform — SEO-first, built as a modular
monolith: Next.js frontend, NestJS REST API, pure TypeScript calculator engine.

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

curl -X POST http://localhost:3001/api/v1/calculators/loan-payment \
  -H "Content-Type: application/json" \
  -d '{"principal":200000,"annualRatePct":6.5,"years":30}'
```

## Workspaces

| Path | Package | Purpose |
|---|---|---|
| `apps/web` | `@calc/web` | Next.js UI (SEO, responsive) |
| `apps/api` | `@calc/api` | NestJS REST API `/api/v1` |
| `packages/calculator-engine` | `@calc/engine` | Pure calculation logic |
| `packages/shared` | `@calc/shared` | Shared types/constants |

## Commands

```bash
pnpm dev / build / test / lint / typecheck
```

## Docs Map

Baseline hierarchy: `PROJECT-BASELINE.md → ARCHITECTURE.md → API-SPEC.md →
DATABASE-SCHEMA.md → CALCULATOR-SPEC.md`. Decisions live in
`docs/decisions/ADR-*.md`. AI agents must follow `AI-CODING-RULES.md`.
