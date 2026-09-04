import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  TeamEvolution,
  type TeamSeasonEntry,
} from "@/components/archive/team-evolution";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow } from "@/components/ui/typography";
import {
  getTeamBySlug,
  getTeamChampionshipSeasons,
  listTeamSlugs,
} from "@/lib/db/queries/teams";
import { orDash } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

/** Same reasoning as the other detail pages: routing-level refusal gives a real 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await listTeamSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/teams/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) return { title: "Team not found" };

  return buildMetadata({
    title: team.name,
    description: `${team.name}, ${team.nationality}. Championships, cars, drivers and seasons in the Apex Archive.`,
    path: `/teams/${team.slug}`,
  });
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border border-t pt-5">
      <dt className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.14em] uppercase">
        {label}
      </dt>
      <dd className="font-display mt-2 text-4xl leading-none font-light">
        {value}
      </dd>
    </div>
  );
}

export default async function TeamDetailPage({
  params,
}: PageProps<"/teams/[slug]">) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) notFound();

  const titleYears = await getTeamChampionshipSeasons(team.id);
  const championYears = new Set(titleYears.map((row) => row.year));

  // One entry per season the archive holds for this team, newest first.
  const years = Array.from(
    new Set([
      ...team.cars.map((car) => car.season.year),
      ...team.driverTeamSeasons.map((link) => link.season.year),
      ...team.constructorStandings.map((row) => row.season.year),
    ]),
  ).sort((a, b) => b - a);

  const seasons: TeamSeasonEntry[] = years.map((year) => {
    const standing = team.constructorStandings.find(
      (row) => row.season.year === year,
    );

    return {
      year,
      cars: team.cars
        .filter((car) => car.season.year === year)
        .map((car) => ({ slug: car.slug, name: car.name })),
      drivers: Array.from(
        new Map(
          team.driverTeamSeasons
            .filter((link) => link.season.year === year)
            .map((link) => [
              link.driver.slug,
              { slug: link.driver.slug, fullName: link.driver.fullName },
            ]),
        ).values(),
      ),
      standing: standing
        ? {
            position: standing.position,
            points: standing.points,
            wins: standing.wins,
          }
        : null,
      wonConstructors: championYears.has(year),
    };
  });

  const activeSpan = team.foundedYear
    ? `${team.foundedYear} — ${team.dissolvedYear ?? "Present"}`
    : team.dissolvedYear
      ? `Until ${team.dissolvedYear}`
      : null;

  const allCars = [...team.cars].sort((a, b) => b.season.year - a.season.year);
  const allDrivers = Array.from(
    new Map(
      team.driverTeamSeasons.map((link) => [link.driver.slug, link.driver]),
    ).values(),
  ).sort((a, b) => a.fullName.localeCompare(b.fullName));

  return (
    <Container>
      <Section>
        <Eyebrow>
          {team.nationality}
          {activeSpan ? ` · ${activeSpan}` : ""}
        </Eyebrow>

        <Display as="h1" size="lg" className="mt-6">
          {team.name}
        </Display>

        {team.baseLocation ? (
          <p className="text-muted-foreground mt-6 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
            Based in {team.baseLocation}
          </p>
        ) : null}

        {team.bio ? (
          <p className="text-muted-foreground mt-8 max-w-2xl leading-relaxed">
            {team.bio}
          </p>
        ) : null}

        <dl className="mt-14 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
          <Stat label="Championships" value={orDash(team.championships)} />
          <Stat label="Wins" value={orDash(team.wins)} />
          <Stat label="Poles" value={orDash(team.poles)} />
          <Stat label="Seasons here" value={String(years.length)} />
        </dl>
        <p className="text-muted-foreground/70 mt-6 font-mono text-[0.6rem] tracking-[0.14em] uppercase">
          A dash means the archive has not verified that figure. Championship
          counts come from the season records.
        </p>

        {/*
          Scoped wording matters: the stat above is the team's real career total, while
          these are only the title years among the seasons the archive holds. Without the
          qualifier, sixteen championships beside two years reads as a contradiction.
        */}
        {titleYears.length > 0 ? (
          <p className="text-primary mt-8 font-mono text-sm tracking-[0.16em] uppercase">
            Title seasons in this archive ·{" "}
            {titleYears.map((r) => r.year).join(", ")}
          </p>
        ) : null}

        {seasons.length > 0 ? (
          <div className="mt-20">
            <TeamEvolution seasons={seasons} teamName={team.name} />
          </div>
        ) : null}

        {allCars.length > 0 ? (
          <div className="mt-20">
            <Eyebrow>Cars in this archive</Eyebrow>
            <ul className="mt-6">
              {allCars.map((car) => (
                <li key={car.slug}>
                  <Link
                    href={`/cars/${car.slug}`}
                    className="group border-border hover:bg-accent -mx-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b px-4 py-5 transition-colors"
                  >
                    <span className="font-display group-hover:text-primary text-xl font-light transition-colors">
                      {car.name}
                    </span>
                    <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                      {car.season.year}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {allDrivers.length > 0 ? (
          <div className="mt-20">
            <Eyebrow>Drivers</Eyebrow>
            <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {allDrivers.map((driver) => (
                <li key={driver.slug}>
                  <Link
                    href={`/drivers/${driver.slug}`}
                    className="font-display hover:text-primary text-xl font-light transition-colors"
                  >
                    {driver.fullName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-border mt-20 border-t pt-8">
          <Link
            href="/teams"
            className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors"
          >
            All teams
          </Link>
        </div>
      </Section>
    </Container>
  );
}
