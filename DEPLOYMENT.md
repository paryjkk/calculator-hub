# Deployment

## Local Development

```bash
pnpm install
docker compose up -d        # PostgreSQL + Redis
pnpm dev                    # web :3000, api :3001
```

API docs: `http://localhost:3001/api/docs` (OpenAPI, added with Auth milestone).

## Production Topology

```
Cloudflare (CDN/WAF/TLS)
  ├── apps/web   → Next.js (SSG/ISR pages + Node runtime where needed)
  └── apps/api   → NestJS container (2+ replicas behind LB)
                     ├── Managed PostgreSQL 18 (backups + PITR)
                     └── Managed Redis
```

## Checklist

- [ ] `DATABASE_URL`, `REDIS_URL`, JWT secrets set from the secret manager
- [ ] Prisma migrations applied (`prisma migrate deploy`)
- [ ] Health check wired to load balancer (`/api/v1/health`)
- [ ] Sentry DSN configured; structured logs shipped
- [ ] GA4/GTM + AdSense IDs injected via env (only after account approval)
- [ ] `robots.txt` + sitemap submitted to Search Console

## CI/CD (GitHub Actions)

1. `lint → typecheck → test → build` on every PR.
2. Merge to `main` → build images → deploy staging → smoke test health endpoint.
3. Manual promotion to production with tagged releases.
