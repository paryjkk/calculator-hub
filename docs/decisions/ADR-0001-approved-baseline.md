# ADR-0001: Official Project Baseline

Status: Accepted
Date: 2026-08-21

## Decision

The project will use:

- Next.js
- React
- TypeScript
- NestJS
- PostgreSQL 18
- Redis
- Prisma
- REST API
- Modular Monolith

## Website Language

English only. No i18n or multilingual routing in MVP.

## Initial Calculators

- Loan Payment
- Loan Amortization
- Age
- Retirement

## Why

This provides:

- SEO capability (SSR/SSG)
- Strong developer experience
- Scalable architecture
- Clear service boundaries
- Low initial operational complexity

## Rejected Alternatives

- **React/Vite-only frontend**: rejected as primary baseline because SEO is important.
- **Microservices from day one**: rejected because operational complexity is not justified for MVP.
- **Arabic-first UI**: rejected per approved English-only policy (see PROJECT-BASELINE.md).
