# Testing

Stack: **Vitest** (unit), **Supertest** (API integration), **Playwright** (E2E).

## Pyramid & Targets

| Level | Location | Scope | Rule |
|---|---|---|---|
| Unit | `packages/calculator-engine/src/__tests__` | Every formula, edge cases | ≥ 90% coverage of engine |
| Integration | `apps/api/test` | HTTP contract per endpoint | DTO validation 400s included |
| E2E | `e2e/` (added later) | Critical user journeys | Auth + save calculation |

## Engine Test Invariants

Every formula in `CALCULATOR-SPEC.md` must have tests covering:

- Happy path values verified against hand-computed results
- Boundary inputs (`r = 0`, minimum years, zero balances)
- Amortization: final balance exactly `0`; Σinterest + Σprincipal = totalPaid
- Age across leap years (Feb 29 births) and year/month boundaries
- Retirement: contributions at year-end ordering; real vs nominal split

## Commands

```bash
pnpm test        # all workspaces
pnpm --filter @calc/engine test
```

CI fails on any failing test, type error, or lint error.
