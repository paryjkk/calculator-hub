import type { MetadataRoute } from "next";
import { CALCULATORS } from "@/lib/calculators";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/calculators`, changeFrequency: "weekly", priority: 0.9 },
    ...CALCULATORS.map((calc) => ({
      url: `${base}/calculators/${calc.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
