# Deployment

## Local Development

```bash
pnpm install
docker compose up -d        # PostgreSQL + Redis
pnpm dev                    # web :3000, api :3001
```

API docs: `http://localhost:3001/api/docs` (OpenAPI, added with Auth milestone).

## Web — Vercel (LIVE)

The web app deploys to Vercel as a **standalone** deployment: a Next.js route
handler (`apps/web/app/api/v1/calculators/[slug]/compute/route.ts`) runs the
calculator engine server-side, so no separate API is required. Setting
`NEXT_PUBLIC_API_URL` later switches all forms to the external NestJS API.

### One-time setup (CLI)

```bash
vercel login
vercel link --yes --project calculator-hub        # from repo root
vercel project update calculator-hub --root-directory apps/web
"$(git remote get-url origin)" > /dev/null        # repo: paryjkk/calculator-hub

printf "https://calculator-hub-ecru.vercel.app" | \
  vercel env add NEXT_PUBLIC_SITE_URL production --no-sensitive
```

`apps/web/vercel.json` pins the framework preset and build commands; the
project-level Root Directory makes Vercel clone the whole monorepo and build
inside `apps/web`.

### Deploy

```bash
vercel deploy --prod --yes                        # from repo root
```

Stable aliases:

- https://calculator-hub-ecru.vercel.app
- https://calculator-hub-jo-c6d3.vercel.app

Optional auto-deploy on push: Settings → Git → connect `paryjkk/calculator-hub`
in the Vercel dashboard.

### Post-deploy smoke test

```bash
curl -s https://calculator-hub-ecru.vercel.app/en | head -c 80
curl -s -X POST https://calculator-hub-ecru.vercel.app/api/v1/calculators/bmi/compute \
  -H "Content-Type: application/json" \
  -d '{"weightKg":70,"heightCm":170}'
# {"bmi":24.22,"categoryCode":"bmi_normal"}
```

## API — future (NestJS container)

```
apps/api → NestJS container (2+ replicas behind LB)
             ├── Managed PostgreSQL 18 (backups + PITR)
             └── Managed Redis
```

Checklist when provisioning:

- [ ] `DATABASE_URL`, `REDIS_URL`, JWT secrets set from the secret manager
- [ ] Prisma migrations applied (`prisma migrate deploy`)
- [ ] Health check wired to load balancer (`/api/v1/health`)
- [ ] Sentry DSN configured; structured logs shipped
- [ ] GA4/GTM + AdSense IDs injected via env (only after account approval)
- [ ] `robots.txt` + sitemap submitted to Search Console
- [ ] Set `NEXT_PUBLIC_API_URL` in Vercel → redeploy web (forms switch over)

## CI (GitHub Actions)

`.github/workflows/ci.yml`: install → prisma generate → typecheck → unit
tests → next build on every push/PR to `main`.
