import type { Locale } from "@calc/shared";
import { CALCULATOR_DEFS, CATEGORIES, defsByCategory } from "@calc/shared";

export interface CalculatorInfo {
  slug: string;
  category: string;
  icon: string;
}

const bySlug = new Map(CALCULATOR_DEFS.map((d) => [d.slug, d]));

export function getCalculator(slug: string) {
  return bySlug.get(slug);
}

export { CALCULATOR_DEFS, CATEGORIES, defsByCategory };
export type { Locale };
