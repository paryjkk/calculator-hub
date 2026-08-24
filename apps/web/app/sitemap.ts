import type { MetadataRoute } from "next";
import { CALCULATOR_DEFS, LOCALES } from "@calc/shared";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    entries.push({
      url: `${BASE}/${locale}`,
      changeFrequency: "weekly",
      priority: 1,
    });
    entries.push({
      url: `${BASE}/${locale}/calculators`,
      changeFrequency: "weekly",
      priority: 0.9,
    });
    for (const def of CALCULATOR_DEFS) {
      entries.push({
        url: `${BASE}/${locale}/calculators/${def.slug}`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
