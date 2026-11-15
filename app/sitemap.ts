import type { MetadataRoute } from "next";
import { SIZES, FAMILIES, sizeHref } from "@/data/sizes";

const SITE = "https://www.rovincetire.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["/", "/sizes", "/machine", "/about", "/contact", "/compliance"].map((p) => ({
    url: SITE + p,
    changeFrequency: "monthly" as const,
    priority: p === "/" ? 1 : 0.7,
  }));
  const linePages = FAMILIES.map((f) => ({
    url: `${SITE}/tires/${f.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const sizePages = SIZES.map((t) => ({
    url: SITE + sizeHref(t),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
  return [...staticPages, ...linePages, ...sizePages];
}
