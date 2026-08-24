# AI Coding Rules

You are implementing the approved project baseline. These rules are binding.

## Before modifying any code

1. Read:
   - `/PROJECT-BASELINE.md`
   - `/ARCHITECTURE.md`
   - `/API-SPEC.md`
   - `/DATABASE-SCHEMA.md`
   - `/CALCULATOR-SPEC.md`
   - this file
2. Verify the current Git commit and tag.
3. Report: baseline ID, commit SHA, branch, detected stack, detected deviations.
4. Do not modify the architecture.
5. If repository state conflicts with the baseline: **STOP** implementation and report the conflict.
6. Do not treat `README.md` alone as authoritative when `PROJECT-BASELINE.md` or ADRs provide more specific decisions.

## Before each implementation task

- Identify affected modules
- Identify applicable architecture rules
- Identify required tests
- Identify API/database impact

## After implementation

Run, in order, and report failures:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Hard rules

1. Never silently change an approved architectural decision — write an ADR first.
2. `packages/calculator-engine` stays pure: no React, NestJS, Prisma, or I/O imports.
3. User-visible results come from the API, never recomputed ad hoc in components.
4. English-only UI strings. No RTL, no i18n scaffolding in MVP.
5. Never commit secrets; use `.env` (gitignored) from `.env.example`.
6. No copy-paste of calculator.net content or markup.
7. Every new calculator: spec section → engine function → unit tests → DTO → endpoint → UI page → docs update.
8. Accessibility is not optional: labeled inputs, focus states, semantic headings (WCAG 2.2 AA target).
9. Prefer editing existing files over creating new ones; follow existing conventions.
