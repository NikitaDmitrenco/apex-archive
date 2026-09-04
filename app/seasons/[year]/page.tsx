import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FavoriteButton } from "@/components/archive/favorite-button";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow } from "@/components/ui/typography";
import { getCurrentUser } from "@/lib/auth/queries";
import {
  getSeasonByYear,
  getSeasonStandings,
  listSeasonYears,
} from "@/lib/db/queries/seasons";
import { isFavorited } from "@/lib/db/queries/favorites";
import { formatPoints, orDash } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

/**
 * Refusing unknown years at the routing layer is the only way to get a real 404 here. An
 * async `generateMetadata` streams the response, so the 200 status is already on the wire
 * by the time a runtime `notFound()` fires — that path yields a soft 404 with status 200.
 * See PROJECT_STATE "Failed approaches" #13 for the full diagnosis.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const years = await listSeasonYears();
  return years.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({
  params,
}: PageProps<"/seasons/[year]">): Promise<Metadata> {
  const { year } = await params;
  const yearNumber = Number.parseInt(year, 10);

  if (!Number.isFinite(yearNumber)) return { title: "Season not found" };

  const season = await getSeasonByYear(yearNumber);

  if (!season) return { title: "Season not found" };

  const inProgress =
    !season.worldChampionDriver && !season.constructorsChampionTeam;

  return buildMetadata({
    title: `${season.year} Season`,
    description:
      season.summary ??
      (inProgress
        ? `Formula 1 ${season.year} season, currently in progress. Calendar, standings and entries in the Apex Archive.`
        : `Formula 1 ${season.year} season — world champion, constructors champion, calendar and standings in the Apex Archive.`),
    path: `/seasons/${season.year}`,
  });
}

/**
 * Postgres.js hands back date columns as ISO strings, but the code defensively handles
 * either shape: an unparseable value renders as a dash rather than crashing the page.
 */
function formatRaceDate(value: string | Date | null | undefined): string {
  if (!value) return orDash(null);
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return orDash(null);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function SeasonDetailPage({
  params,
}: PageProps<"/seasons/[year]">) {
  const { year } = await params;
  const yearNumber = Number.parseInt(year, 10);

  if (!Number.isFinite(yearNumber)) notFound();

  const [season, standings] = await Promise.all([
    getSeasonByYear(yearNumber),
    getSeasonStandings(yearNumber),
  ]);

  if (!season) notFound();

  const [user, saved] = await Promise.all([
    getCurrentUser(),
    isFavorited("season", season.id),
  ]);

  const orderedRaces = [...season.races].sort(
    (a, b) => a.roundNumber - b.roundNumber,
  );

  const orderedCars = [...season.cars].sort((a, b) =>
    a.team.name.localeCompare(b.team.name),
  );

  const worldChampion = season.worldChampionDriver;
  const constructorsChampion = season.constructorsChampionTeam;
  const hasWorldChampion = Boolean(worldChampion);
  const hasConstructorsChampion = Boolean(constructorsChampion);
  const inProgress = !hasWorldChampion && !hasConstructorsChampion;

  return (
    <Container>
      <Section>
        <Eyebrow>Formula 1 · World Championship</Eyebrow>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
          <Display as="h1" size="lg">
            {season.year}
          </Display>
          <FavoriteButton
            entityType="season"
            entityId={season.id}
            initialFavorited={saved}
            signedIn={Boolean(user)}
          />
        </div>

        {season.summary ? (
          <p className="text-muted-foreground mt-8 max-w-2xl leading-relaxed">
            {season.summary}
          </p>
        ) : null}

        <div className="mt-14">
          <Eyebrow>Champions</Eyebrow>

          {inProgress ? (
            <p className="text-muted-foreground mt-6 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
              Season in progress — champion not yet decided
            </p>
          ) : (
            <dl className="mt-6 grid gap-x-12 gap-y-8 sm:grid-cols-2">
              <div className="border-border border-t pt-5">
                <dt className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                  Drivers&apos; champion
                </dt>
                <dd className="font-display mt-3 text-3xl leading-none font-light">
                  {hasWorldChampion && worldChampion ? (
                    <Link
                      href={`/drivers/${worldChampion.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {worldChampion.fullName}
                    </Link>
                  ) : (
                    orDash(null)
                  )}
                </dd>
              </div>

              <div className="border-border border-t pt-5">
                <dt className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                  Constructors&apos; champion
                </dt>
                <dd className="font-display mt-3 text-3xl leading-none font-light">
                  {hasConstructorsChampion && constructorsChampion ? (
                    <Link
                      href={`/teams/${constructorsChampion.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {constructorsChampion.name}
                    </Link>
                  ) : (
                    orDash(null)
                  )}
                </dd>
              </div>
            </dl>
          )}
        </div>

        <div className="mt-20">
          <Eyebrow>Calendar</Eyebrow>

          {orderedRaces.length > 0 ? (
            <ol className="mt-6">
              {orderedRaces.map((race) => (
                <li
                  key={race.id}
                  className="border-border flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b py-5"
                >
                  <span className="text-muted-foreground w-12 shrink-0 font-mono text-sm">
                    R{race.roundNumber}
                  </span>
                  <span className="flex-1 text-lg">{race.name}</span>
                  <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                    {formatRaceDate(race.date)}
                  </span>
                  <Link
                    href={`/circuits/${race.circuit.slug}`}
                    className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors"
                  >
                    {race.circuit.name}
                  </Link>
                  {race.winnerDriver ? (
                    <Link
                      href={`/drivers/${race.winnerDriver.slug}`}
                      className="hover:text-primary font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors"
                    >
                      {race.winnerDriver.fullName}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground/50 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                      Winner not recorded
                    </span>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-muted-foreground border-border mt-8 border-t pt-6 leading-relaxed">
              The archive holds no race calendar for this season.
            </p>
          )}
        </div>

        {standings.drivers.length > 0 ? (
          <div className="mt-20">
            <Eyebrow>Drivers&apos; championship</Eyebrow>
            <table className="mt-6 w-full text-left">
              <caption className="sr-only">
                Drivers&apos; championship standings for {season.year}
              </caption>
              <thead>
                <tr className="text-muted-foreground border-border border-b font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                  <th scope="col" className="w-10 py-3 font-normal">
                    Pos
                  </th>
                  <th scope="col" className="py-3 font-normal">
                    Driver
                  </th>
                  <th scope="col" className="py-3 font-normal">
                    Team
                  </th>
                  <th scope="col" className="py-3 text-right font-normal">
                    Wins
                  </th>
                  <th scope="col" className="py-3 text-right font-normal">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {standings.drivers.map((row) => (
                  <tr key={row.driverSlug} className="border-border border-b">
                    <td className="text-muted-foreground py-4 font-mono text-sm">
                      {row.position}
                    </td>
                    <td className="py-4">
                      <Link
                        href={`/drivers/${row.driverSlug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {row.driverName}
                      </Link>
                    </td>
                    <td className="py-4">
                      <Link
                        href={`/teams/${row.teamSlug}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {row.teamName}
                      </Link>
                    </td>
                    <td className="py-4 text-right font-mono text-sm">
                      {orDash(row.wins)}
                    </td>
                    <td className="py-4 text-right font-mono text-sm">
                      {formatPoints(row.points)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {standings.constructors.length > 0 ? (
          <div className="mt-20">
            <Eyebrow>Constructors&apos; championship</Eyebrow>
            <table className="mt-6 w-full text-left">
              <caption className="sr-only">
                Constructors&apos; championship standings for {season.year}
              </caption>
              <thead>
                <tr className="text-muted-foreground border-border border-b font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                  <th scope="col" className="w-10 py-3 font-normal">
                    Pos
                  </th>
                  <th scope="col" className="py-3 font-normal">
                    Constructor
                  </th>
                  <th scope="col" className="py-3 text-right font-normal">
                    Wins
                  </th>
                  <th scope="col" className="py-3 text-right font-normal">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {standings.constructors.map((row) => (
                  <tr key={row.teamSlug} className="border-border border-b">
                    <td className="text-muted-foreground py-4 font-mono text-sm">
                      {row.position}
                    </td>
                    <td className="py-4">
                      <Link
                        href={`/teams/${row.teamSlug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {row.teamName}
                      </Link>
                    </td>
                    <td className="py-4 text-right font-mono text-sm">
                      {orDash(row.wins)}
                    </td>
                    <td className="py-4 text-right font-mono text-sm">
                      {formatPoints(row.points)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {orderedCars.length > 0 ? (
          <div className="mt-20">
            <Eyebrow>Cars</Eyebrow>
            <ul className="mt-6">
              {orderedCars.map((car) => (
                <li key={car.id}>
                  <Link
                    href={`/cars/${car.slug}`}
                    className="group border-border hover:bg-accent -mx-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b px-4 py-5 transition-colors"
                  >
                    <span className="font-display group-hover:text-primary text-xl font-light transition-colors">
                      {car.name}
                    </span>
                    <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                      {car.team.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-border mt-20 border-t pt-8">
          <Link
            href="/seasons"
            className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors"
          >
            All seasons
          </Link>
        </div>
      </Section>
    </Container>
  );
}
