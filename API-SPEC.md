# API Specification

Base URL: `{API_HOST}/api/v1` — JSON only.

## Health

`GET /api/v1/health`

```json
{ "status": "ok", "version": "1.0.0" }
```

## Calculators

All calculator endpoints are `POST` with a JSON body and return a JSON result.
Validation errors → `400 { "message": string[], "error": "Bad Request" }`.

### POST /api/v1/calculators/loan-payment

Request:

```json
{ "principal": 200000, "annualRatePct": 6.5, "years": 30 }
```

Response:

```json
{
  "monthlyPayment": 1264.14,
  "totalPaid": 455088.46,
  "totalInterest": 255088.46
}
```

Rules: `principal > 0`, `annualRatePct >= 0`, `years >= 1` (integer).
`annualRatePct = 0` uses straight-line division (no compounding).

### POST /api/v1/calculators/loan-amortization

Request: same as loan-payment.

Response adds a monthly schedule:

```json
{
  "monthlyPayment": 1264.14,
  "schedule": [
    { "month": 1, "payment": 1264.14, "interest": 1083.33, "principal": 180.81, "balance": 199819.19 }
  ]
}
```

### POST /api/v1/calculators/age

```json
{ "birthDate": "1990-06-15", "onDate": "2026-08-21" }
```

```json
{
  "years": 36, "months": 2, "days": 6,
  "totalMonths": 434, "totalWeeks": 1883, "totalDays": 13184,
  "nextBirthdayInDays": 298
}
```

`onDate` optional, defaults to today (UTC). `birthDate <= onDate` required.

### POST /api/v1/calculators/retirement

```json
{
  "currentAge": 30,
  "retirementAge": 65,
  "currentSavings": 50000,
  "annualContribution": 12000,
  "expectedReturnPct": 7,
  "inflationPct": 2.5
}
```

```json
{
  "yearsToRetirement": 35,
  "projectedNominal": 2411271.22,
  "projectedReal": 1018607.31,
  "totalContributions": 470000,
  "yearly": [ { "year": 1, "balance": 65350.0 } ]
}
```

## Conventions

- Money fields: decimal numbers, no currency formatting in API responses.
- Dates: ISO `YYYY-MM-DD`.
- Versioning: path prefix only (`/api/v1`). Breaking changes require `/api/v2`.
