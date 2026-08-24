# Database Schema

PostgreSQL 18, accessed via Prisma. Migrations are authoritative — never edit
the database manually.

## MVP Tables

### users

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default `gen_random_uuid()` |
| email | text | unique, not null, lowercase |
| passwordHash | text | not null (Argon2id) |
| displayName | text | not null |
| role | enum(`USER`,`ADMIN`) | default `USER` |
| createdAt / updatedAt | timestamptz | defaults now() |

### saved_calculations

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| userId | uuid | FK → users.id, ON DELETE CASCADE |
| calculatorType | enum(`LOAN_PAYMENT`,`LOAN_AMORTIZATION`,`AGE`,`RETIREMENT`) | not null |
| name | text | not null (user label) |
| inputs | jsonb | not null (validated DTO) |
| result | jsonb | not null (API response snapshot) |
| createdAt / updatedAt | timestamptz | |

Indexes:

- `saved_calculations(userId, createdAt desc)` — dashboard listing
- `users(email)` unique

## Redis Keyspaces

| Pattern | Purpose | TTL |
|---|---|---|
| `rl:{ip}:{route}` | rate-limit counters | 60s |
| `rt:{userId}:{jti}` | refresh-token rotation state | 30d |
| `cache:calc:{hash}` | hot calculation responses | 10min (optional) |

## Rules

1. Money values are stored as computed JSON snapshots; no floating-point columns for money in MVP (results are derived, not accumulated).
2. All timestamps: `timestamptz`, UTC.
3. Deleting a user cascades their saved calculations.
4. Schema changes require a new Prisma migration committed with the code change.
