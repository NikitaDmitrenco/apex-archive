import type { Metadata } from "next";

import { SearchForm } from "@/components/archive/search-form";
import { SearchResults } from "@/components/archive/search-results";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import { globalSearch } from "@/lib/db/queries/search";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the Apex Archive across cars, drivers, teams, circuits and seasons of Formula 1.",
};

export default async function SearchPage({
  searchParams,
}: PageProps<"/search">) {
  const params = await searchParams;
  const rawQuery = typeof params.q === "string" ? params.q : "";
  const trimmedQuery = rawQuery.trim();

  // Two empty states, not one: when the user hasn't typed yet we invite them in, and when
  // they have typed but the archive has nothing we explain why. Rendering both through the
  // same component would mix the tones.
  const results = trimmedQuery ? await globalSearch(trimmedQuery) : null;

  return (
    <Container>
      <Section>
        <Eyebrow>Archive</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          Search
        </Display>
        <Lede className="mt-8">
          One query across the machines, the drivers, the teams, the circuits
          and the seasons of Formula 1. Results are grouped by entity type.
        </Lede>

        <div className="mt-14">
          {/* key forces a remount when the URL changes externally (e.g. browser back),
              which keeps the input value in sync without an effect that would touch
              state from inside an effect. */}
          <SearchForm key={trimmedQuery} initialQuery={trimmedQuery} />
        </div>

        {results ? (
          <SearchResults results={results} />
        ) : (
          <div className="border-border mt-14 border-t pt-12">
            <Display as="p" size="sm">
              Type a name, a team, a circuit, a year.
            </Display>
            <p className="text-muted-foreground mt-6 max-w-md leading-relaxed">
              The archive holds machines, drivers, teams, circuits and seasons.
              Search any of them — a surname, a constructor, a country, a four
              digit year.
            </p>
          </div>
        )}
      </Section>
    </Container>
  );
}
