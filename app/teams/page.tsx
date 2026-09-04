import type { Metadata } from "next";

import { TeamCard } from "@/components/archive/team-card";
import { TeamFilters } from "@/components/archive/team-filters";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import { listTeamNationalities, listTeams } from "@/lib/db/queries/teams";
import { withoutBlanks } from "@/lib/search-params";
import { teamFiltersSchema } from "@/lib/validation/filters";

export const metadata: Metadata = {
  title: "Teams",
};

export default async function TeamsPage({ searchParams }: PageProps<"/teams">) {
  const parsed = teamFiltersSchema.safeParse(withoutBlanks(await searchParams));
  const filters = parsed.success ? parsed.data : teamFiltersSchema.parse({});

  const [teams, nationalities] = await Promise.all([
    listTeams(filters),
    listTeamNationalities(),
  ]);

  return (
    <Container>
      <Section>
        <Eyebrow>Archive</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          Teams
        </Display>
        <Lede className="mt-8">
          The constructors, their championships, and the cars and drivers that
          carried them.
        </Lede>

        <div className="mt-14">
          <TeamFilters
            nationalities={nationalities}
            selected={{
              nationality: filters.nationality,
              activeOnly: filters.activeOnly,
              championsOnly: filters.championsOnly,
            }}
            resultCount={teams.length}
          />
        </div>

        {teams.length > 0 ? (
          <div className="mt-14 grid gap-x-12 gap-y-10 lg:grid-cols-2">
            {teams.map((team) => (
              <TeamCard key={team.slug} team={team} />
            ))}
          </div>
        ) : (
          <div className="border-border mt-14 border-t pt-12">
            <Display as="p" size="sm">
              No teams match those filters.
            </Display>
            <p className="text-muted-foreground mt-6 max-w-md leading-relaxed">
              The archive is a curated set rather than a complete record, so a
              constructor that raced in the sport may still have no entry here.
              Try widening one of the filters.
            </p>
          </div>
        )}
      </Section>
    </Container>
  );
}
