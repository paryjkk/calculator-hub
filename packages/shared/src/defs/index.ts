import type { CalculatorDef, CategoryId } from "../types";
import { FINANCIAL_DEFS } from "./financial";
import { HEALTH_DEFS } from "./health";
import { MATH_DEFS } from "./math";
import { CONVERSION_DEFS } from "./conversion";
import { DATETIME_DEFS } from "./datetime";
import { UTILITIES_DEFS } from "./utilities";

export const CALCULATOR_DEFS: CalculatorDef[] = [
  ...FINANCIAL_DEFS,
  ...HEALTH_DEFS,
  ...MATH_DEFS,
  ...CONVERSION_DEFS,
  ...DATETIME_DEFS,
  ...UTILITIES_DEFS,
];

const bySlug = new Map(CALCULATOR_DEFS.map((d) => [d.slug, d]));

export function getDef(slug: string): CalculatorDef | undefined {
  return bySlug.get(slug);
}

export function defsByCategory(category: CategoryId): CalculatorDef[] {
  return CALCULATOR_DEFS.filter((d) => d.category === category);
}
