import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/quote", "/private-label"] },
    sitemap: "https://www.rovincetire.com/sitemap.xml",
  };
}
