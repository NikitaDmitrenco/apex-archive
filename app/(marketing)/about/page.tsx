import type { Metadata } from "next";
import Link from "next/link";

import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About",
  description: `What ${SITE_NAME} is, where its data comes from, and how the archive is curated. ${SITE_DESCRIPTION}`,
};

export default function AboutPage() {
  return (
    <Container>
      <Section>
        <Eyebrow>About</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          A digital archive of Formula 1
        </Display>

        <div className="mt-10 max-w-2xl space-y-8">
          <Lede className="mt-0">
            Apex Archive is a curated record of the machines, the drivers, the
            teams and the circuits that have defined Formula 1 across more than
            seven decades. It is not a fan site and not a results dashboard — it
            is an editorial archive, written and updated one entity at a time,
            and built to be walked through rather than searched for answers.
          </Lede>

          <p className="text-muted-foreground leading-relaxed">
            The data behind the pages is assembled from authoritative public
            sources — official Formula 1 records, season-by-season result tables
            and long-form statistical archives — and cross-referenced against
            Wikipedia as a secondary check. Where sources disagree, the
            disagreement is logged in the project notes rather than silently
            resolved in favour of the more flattering number.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            The archive records what it can verify, and shows nothing when it
            cannot. An empty field is never a quiet zero: a dash means the
            figure has not been verified, not that it has been verified to be
            zero. Career totals, in particular, are limited to figures that
            could be sourced; the rest of this work is open and ongoing.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            The site itself is a Next.js application on Supabase Postgres,
            served through Drizzle and built without fabricated statistics or
            invented images. Where photography is missing the layout shows an
            empty frame rather than a plausible stand-in; where race data has
            not been seeded, the page says so. The archive would rather show
            nothing than a plausible invention.
          </p>
        </div>

        <div className="border-border mt-16 border-t pt-8">
          <Link
            href="/cars"
            className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors"
          >
            Browse the archive
          </Link>
        </div>
      </Section>
    </Container>
  );
}
