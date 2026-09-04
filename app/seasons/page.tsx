import type { Metadata } from "next";

import { SeasonCard } from "@/components/archive/season-card";
import { SeasonFilters } from "@/components/archive/season-filters";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import {
  getEarliestAndLatestSeason,
  listSeasonYears,
  listSeasonsForCatalog,
} from "@/lib/db/queries/seasons";
import { withoutBlanks } from "@/lib/search-params";
import { seasonFiltersSchema } from "@/lib/validation/filters";

export const metadata: Metadata = {
  title: "Seasons",
  description:
    "Every Formula 1 season in the Apex Archive — champions, calendars and standings, decade by decade.",
};

export default async function SeasonsPage({
  searchParams,
}: PageProps<"/seasons">) {
  const parsed = seasonFiltersSchema.safeParse(
    withoutBlanks(await searchParams),
  );

  // A malformed query string falls back to the unfiltered catalogue instead of erroring.
  const filters = parsed.success ? parsed.data : seasonFiltersSchema.parse({});

  const [seasons, years, range] = await Promise.all([
    listSeasonsForCatalog(filters),
    listSeasonYears(),
    getEarliestAndLatestSeason(),
  ]);

  const decades = Array.from(
    new Set(years.map((year) => Math.floor(year / 10) * 10)),
  ).sort((a, b) => b - a);

  return (
    <Container>
      <Section>
        <Eyebrow>Archive</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          Seasons
        </Display>
        <Lede className="mt-8">
          {range.earliest && range.latest
            ? `Every championship season the archive covers, from ${range.earliest} to ${range.latest}.`
            : "Every championship season the archive covers."}
        </Lede>

        <div className="mt-14">
          <SeasonFilters
            decades={decades}
            selected={{ decade: filters.decade }}
            resultCount={seasons.length}
          />
        </div>

        {seasons.length > 0 ? (
          <div className="mt-14 space-y-10">
            {seasons.map((season) => (
              <SeasonCard key={season.year} season={season} />
            ))}
          </div>
        ) : (
          <div className="border-border mt-14 border-t pt-12">
            <Display as="p" size="sm">
              No seasons match those filters.
            </Display>
            <p className="text-muted-foreground mt-6 max-w-md leading-relaxed">
              The archive is a curated set rather than a complete record, so a
              year that exists in the sport may still have no entry here. Try
              widening the decade filter.
            </p>
          </div>
        )}
      </Section>
    </Container>
  );
}
