# Calculator Specifications

Formulas are independently derived and documented here. They are the single
source of truth for implementation and tests. Do not copy third-party site
content (see PROJECT-BASELINE.md §8).

## 1. Loan Monthly Payment

Inputs: `principal > 0`, `annualRatePct ≥ 0`, `years` integer ≥ 1.

Let `n = years × 12`, monthly rate `r = annualRatePct / 100 / 12`.

- If `r = 0`: `monthlyPayment = principal / n`
- Else (standard annuity):

```
monthlyPayment = P · r · (1+r)^n / ((1+r)^n − 1)
totalPaid      = monthlyPayment × n
totalInterest  = totalPaid − principal
```

Rounding: full precision internally; round to 2 decimals only at the API edge.

## 2. Loan Amortization

Same inputs. Iterative schedule, month by month:

```
interest_m   = balance × r
principal_m  = payment − interest_m
balance_{m+1} = balance − principal_m
```

Final month: `principal_n = balance` (absorbs rounding drift), so the ending
balance is exactly `0`. Invariants tested:

- `Σ interest + Σ principal = totalPaid`
- final `balance = 0`

## 3. Age

Inputs: `birthDate ≤ onDate ≤ today` (ISO dates; `onDate` defaults to today UTC).

Algorithm (calendar-aware, no fixed 30-day months):

1. Whole years: largest `y` with `birth + y years ≤ on`.
2. Whole months after that.
3. Remaining days computed against the actual length of the previous month
   of `on` (handles leap years via standard date arithmetic).
4. Totals: `totalDays` from UTC day difference; weeks/months/hours derived.
5. `nextBirthdayInDays`: days to next occurrence of birth month/day;
   Feb 29 birthdays celebrate Mar 1 in non-leap years.

## 4. Retirement Projection

Inputs: `currentAge < retirementAge`, amounts ≥ 0,
`expectedReturnPct ≥ 0`, `inflationPct ≥ 0`, `inflationPct < expectedReturnPct` allowed.

Yearly compounding with contributions made at year-end:

```
balance_0 = currentSavings
balance_t = balance_{t−1} × (1 + R) + C        for t = 1..Y
projectedNominal = balance_Y
projectedReal    = projectedNominal / (1 + I)^Y
totalContributions = C × Y
yearly[] = per-year balances
```

Where `R` = expectedReturnPct/100, `I` = inflationPct/100, `C` =
annualContribution, `Y` = retirementAge − currentAge.

## General Rules

- Pure functions only — no Date.now(), no randomness, no I/O inside the engine.
- Every formula above must have unit tests including edge cases
  (`r = 0`, single-year horizons, leap-year birthdays).
- Rounding happens once at the boundary, never inside iterative loops.
