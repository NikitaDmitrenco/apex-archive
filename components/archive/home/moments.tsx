import Link from "next/link";

import { SectionHeader } from "@/components/archive/section-header";
import { Container, Section } from "@/components/ui/container";
import type { SeasonListItem } from "@/lib/db/queries/seasons";

/**
 * Seasons the archive has something to say about, read as an editorial timeline. The
 * running season is excluded: it has its own block above and belongs to now, not history.
 */
export function Moments({
  seasons,
  excludeYear,
}: {
  seasons: SeasonListItem[];
  excludeYear?: number;
}) {
  const withSummary = seasons.filter(
    (season) => season.summary && season.year !== excludeYear,
  );

  if (withSummary.length === 0) return null;

  return (
    <Section className="border-border border-b">
      <Container>
        <SectionHeader eyebrow="History" title="Moments" href="/seasons" />

        <ol className="mt-2">
          {withSummary.map((season) => (
            <li key={season.year}>
              <Link
                href={`/seasons/${season.year}`}
                className="group border-border hover:bg-accent -mx-4 flex flex-col gap-3 border-b px-4 py-7 transition-colors md:flex-row md:gap-12"
              >
                <span className="font-display group-hover:text-primary shrink-0 text-3xl leading-none font-light transition-colors md:w-32">
                  {season.year}
                </span>
                <span className="text-muted-foreground max-w-2xl leading-relaxed">
                  {season.summary}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
