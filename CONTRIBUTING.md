# Contributing

1. Read `PROJECT-BASELINE.md` and `AI-CODING-RULES.md` first.
2. Branch from `main`: `feat/<topic>` or `fix/<topic>`.
3. Every PR must pass: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
4. New calculators follow the full chain: spec → engine → tests → DTO → endpoint → UI → docs.
5. Architectural changes require an ADR **before** the PR.
6. Commits: conventional style (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
