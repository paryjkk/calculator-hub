import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { randomInt, randomUUID } from "node:crypto";
import {
  age,
  amortization,
  CalcError,
  loanPayment,
  retirement,
  RUNNERS,
} from "@calc/engine";
import { CALCULATOR_DEFS, getDef, validateInput } from "@calc/shared";
import { PrismaService } from "../../prisma/prisma.service";
import type { AgeDto, LoanPaymentDto, RetirementDto } from "./calculators.dto";

type Values = Record<string, number | string>;

const SEEDED_SLUGS = new Set(["random-number", "dice-roller", "random-picker"]);

export class ContactDto {
  @IsEmail()
  email!: string;

  @IsString() @MinLength(5) @MaxLength(4000)
  body!: string;
}

@Injectable()
export class CalculatorsService {
  constructor(private readonly prisma: PrismaService) {}

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

    const values = result.values;

    let out: unknown;
    try {
      out = this.runNative(slug, values);
    } catch (err) {
      if (err instanceof CalcError) throw new BadRequestException(err.code);
      throw err;
    }

    void this.prisma.usageEvent.create({ data: { slug } }).catch(() => undefined);
    return out;
  }

  private runNative(slug: string, v: Values): unknown {
    if (slug === "password-generator") return generatePassword(v);
    if (slug === "uuid-generator") return generateUuids(v);

    const runner = RUNNERS[slug];
    if (!runner) throw new NotFoundException(`No runner for: ${slug}`);

    const withDefaults = { ...v };
    const def = getDef(slug)!;
    for (const field of def.fields) {
      if (field.serverDefault === "today" && withDefaults[field.name] === undefined) {
        withDefaults[field.name] = new Date().toISOString().slice(0, 10);
      }
    }
    if (SEEDED_SLUGS.has(slug)) {
      withDefaults.seed = randomInt(1, 2 ** 31);
    }
    return runner(withDefaults);
  }
}

function charset(onOff: unknown, chars: string): string {
  return onOff === "on" ? chars : "";
}

function generatePassword(v: Values) {
  const length = Number(v.length);
  const sets = [
    charset(v.uppercase, "ABCDEFGHJKLMNPQRSTUVWXYZ"),
    charset(v.lowercase, "abcdefghijkmnpqrstuvwxyz"),
    charset(v.digits, "23456789"),
    charset(v.symbols, "!@#$%^&*()-_=+[]{};:,.?"),
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

@Controller("calculators")
export class CalculatorsController {
  constructor(private readonly calculators: CalculatorsService) {}

  @Get()
  list() {
    return {
      count: CALCULATOR_DEFS.length,
      calculators: CALCULATOR_DEFS.map((d) => ({
        slug: d.slug,
        category: d.category,
        icon: d.icon,
      })),
    };
  }

  @Post(":slug/compute")
  compute(@Param("slug") slug: string, @Body() body: unknown) {
    return this.calculators.compute(slug, body);
  }
}

@Injectable()
export class SiteConfigService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public payload consumed by the web app (no auth). */
  async config() {
    const [overrides, settings] = await Promise.all([
      this.prisma.calculatorOverride.findMany(),
      this.prisma.siteSetting.findMany(),
    ]);
    return {
      calculators: overrides.map((o) => ({
        slug: o.slug,
        hidden: o.hidden,
        titleEn: o.titleEn,
        titleAr: o.titleAr,
        shortEn: o.shortEn,
        shortAr: o.shortAr,
        descEn: o.descEn,
        descAr: o.descAr,
      })),
      settings: Object.fromEntries(settings.map((s) => [s.key, s.value])),
    };
  }

  saveContact(email: string, body: string) {
    return this.prisma.contactMessage.create({ data: { email, body } });
  }
}

@Controller("site-config")
export class SiteConfigController {
  constructor(private readonly siteConfig: SiteConfigService) {}

  @Get()
  config() {
    return this.siteConfig.config();
  }

  @Post("contact")
  async contact(@Body() dto: ContactDto) {
    if (typeof dto.email !== "string" || typeof dto.body !== "string") {
      throw new BadRequestException();
    }
    await this.siteConfig.saveContact(dto.email, dto.body);
    return { ok: true };
  }
}

@Module({
  controllers: [CalculatorsController, SiteConfigController],
  providers: [CalculatorsService, SiteConfigService],
})
export class CalculatorsModule {}


