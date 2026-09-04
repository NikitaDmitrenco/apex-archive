import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep API endpoints and the auth flow out of the index — they're either internal
        // (API routes) or contain token-bearing URLs that should not be searchable.
        disallow: ["/api/", "/auth/", "/account", "/login", "/signup"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
