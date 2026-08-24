import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { randomInt, randomUUID } from "node:crypto";
import {
  age,
  amortization,
  CalcError,
  loanPayment,
  retirement,
  RUNNERS,
} from "@calc/engine";
import { getDef, validateInput } from "@calc/shared";
import type { AgeDto, LoanPaymentDto, RetirementDto } from "./calculators.dto";

type Values = Record<string, number | string>;

const SEEDED_SLUGS = new Set(["random-number", "dice-roller", "random-picker"]);

@Injectable()
export class CalculatorsService {
  loanPayment(dto: LoanPaymentDto) {
    return loanPayment(dto);
  }

  amortization(dto: LoanPaymentDto) {
    return amortization(dto);
  }

  age(dto: AgeDto) {
    const onDate = dto.onDate ?? new Date().toISOString().slice(0, 10);
    if (dto.birthDate > onDate) {
      throw new BadRequestException("birthDate must be on or before onDate");
    }
    return age({ birthDate: dto.birthDate, onDate });
  }

  retirement(dto: RetirementDto) {
    if (dto.retirementAge <= dto.currentAge) {
      throw new BadRequestException(
        "retirementAge must be greater than currentAge"
      );
    }
    return retirement(dto);
  }

  compute(slug: string, raw: unknown): unknown {
    const def = getDef(slug);
    if (!def) throw new NotFoundException(`Unknown calculator: ${slug}`);

    const body = (raw ?? {}) as Record<string, unknown>;
    const result = validateInput(def, body);
    if (!result.ok || !result.values) {
      throw new BadRequestException({ fieldErrors: result.errors });
    }

    const values = this.applyServerDefaults(def.slug, result.values);

    if (def.slug === "password-generator") {
      return generatePassword(values);
    }
    if (def.slug === "uuid-generator") {
      return generateUuids(values);
    }

    let runner = RUNNERS[slug];
    if (!runner) throw new NotFoundException(`No runner for: ${slug}`);

    try {
      return runner(values);
    } catch (err) {
      if (err instanceof CalcError) throw new BadRequestException(err.code);
      throw err;
    }
  }

  private applyServerDefaults(_slug: string, values: Values): Values {
    const out = { ...values };
    const def = getDef(_slug)!;
    for (const field of def.fields) {
      if (field.serverDefault === "today" && out[field.name] === undefined) {
        out[field.name] = new Date().toISOString().slice(0, 10);
      }
    }
    if (SEEDED_SLUGS.has(_slug) && out.seed === undefined) {
      out.seed = randomInt(1, 2 ** 31);
    }
    return out;
  }
}

function charsetFrom(onOff: number | string | undefined, chars: string): string {
  return onOff === "on" ? chars : "";
}

function generatePassword(v: Values) {
  const length = Number(v.length);
  const pool =
    charsetFrom(v.uppercase, "ABCDEFGHJKLMNPQRSTUVWXYZ") +
    charsetFrom(v.lowercase, "abcdefghijkmnpqrstuvwxyz") +
    charsetFrom(v.digits, "23456789") +
    charsetFrom(v.symbols, "!@#$%^&*()-_=+[]{};:,.?");

  const sets = [
    charsetFrom(v.uppercase, "ABCDEFGHJKLMNPQRSTUVWXYZ"),
    charsetFrom(v.lowercase, "abcdefghijkmnpqrstuvwxyz"),
    charsetFrom(v.digits, "23456789"),
    charsetFrom(v.symbols, "!@#$%^&*()-_=+[]{};:,.?"),
  ].filter((s) => s.length > 0);

  if (sets.length === 0) throw new CalcError("ERR_NO_CHARSETS");

  const picked = sets.map((s) => s[randomInt(0, s.length)]);
  while (picked.length < length) {
    const set = sets[randomInt(0, sets.length)];
    picked.push(set[randomInt(0, set.length)]);
  }

  for (let i = picked.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }

  return { password: picked.slice(0, length).join("") };
}

function generateUuids(v: Values) {
  const count = Math.min(Number(v.count ?? 1), 50);
  const uuids = Array.from({ length: count }, () => randomUUID());
  return { valuesText: uuids.join("\n"), count };
}
