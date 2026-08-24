import { Type } from "class-transformer";
import {
  IsDate,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from "class-validator";
import { LIMITS } from "@calc/shared";

export class LoanPaymentDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  @Max(LIMITS.maxPrincipal)
  principal!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(LIMITS.maxRatePct)
  annualRatePct!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(LIMITS.maxYears)
  years!: number;
}

export class AgeDto {
  @IsISO8601({ strict: true })
  birthDate!: string;

  @IsOptional()
  @IsISO8601({ strict: true })
  onDate?: string;
}

export class RetirementDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(LIMITS.maxAge)
  currentAge!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(LIMITS.maxAge)
  retirementAge!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  currentSavings!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  annualContribution!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(LIMITS.maxRatePct)
  expectedReturnPct!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(LIMITS.maxRatePct)
  inflationPct!: number;
}
