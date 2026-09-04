import type { Metadata } from "next";

export const SITE_NAME = "Apex Archive";
export const SITE_DESCRIPTION =
  "The machines. The drivers. The circuits. The stories. A digital archive of Formula 1, 1950—2026.";

/**
 * Absolute base URL for the site. Falls back to localhost so build environments without the
 * variable still resolve `metadataBase`. The value is evaluated once at module load — Next
 * populates `process.env.NEXT_PUBLIC_SITE_URL` from `.env.local` before any user code runs.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Builds a uniform `Metadata` object for detail and catalogue pages. Next's layout-level
 * `title.template` does not apply to `openGraph.title`, so the suffix is composed here.
 */
export function buildMetadata(input: {
  title: string;
  description?: string;
  path: string;
}): Metadata {
  const description = input.description ?? SITE_DESCRIPTION;
  const composedTitle = `${input.title} · ${SITE_NAME}`;

  return {
    title: input.title,
    description,
    alternates: { canonical: input.path },
    openGraph: {
      title: composedTitle,
      description,
      url: input.path,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: composedTitle,
      description,
    },
  };
}
