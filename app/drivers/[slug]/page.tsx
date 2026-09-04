import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FavoriteButton } from "@/components/archive/favorite-button";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow } from "@/components/ui/typography";
import { getCurrentUser } from "@/lib/auth/queries";
import {
  getDriverBySlug,
  getDriverChampionshipSeasons,
  listDriverSlugs,
} from "@/lib/db/queries/drivers";
import { isFavorited } from "@/lib/db/queries/favorites";
import { formatPoints, orDash } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

/** Same reasoning as the car detail page: routing-level refusal gives a real 404. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await listDriverSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/drivers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const driver = await getDriverBySlug(slug);

  if (!driver) return { title: "Driver not found" };

  const titles = driver.championships
    ? `${driver.championships}× world champion. `
    : "";

  return buildMetadata({
    title: driver.fullName,
    description: `${driver.fullName}, ${driver.nationality}. ${titles}Career record and related entries in the Apex Archive.`,
    path: `/drivers/${driver.slug}`,
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

export default async function DriverDetailPage({
  params,
}: PageProps<"/drivers/[slug]">) {
  const { slug } = await params;
  const driver = await getDriverBySlug(slug);

  if (!driver) notFound();

  const [titleYears, user, saved] = await Promise.all([
    getDriverChampionshipSeasons(driver.id),
    getCurrentUser(),
    isFavorited("driver", driver.id),
  ]);

  // Newest first: a career reads better backwards from where the driver ended up.
  const timeline = [...driver.driverTeamSeasons].sort(
    (a, b) => b.season.year - a.season.year,
  );
  const standings = [...driver.driverStandings].sort(
    (a, b) => b.season.year - a.season.year,
  );

  const teams = Array.from(
    new Map(
      driver.driverTeamSeasons.map((link) => [link.team.slug, link.team]),
    ).values(),
  );

  const careerSpan = driver.careerStartYear
    ? `${driver.careerStartYear} — ${driver.careerEndYear ?? "Present"}`
    : orDash(null);

  return (
    <Container>
      <Section>
        <Eyebrow>
          {driver.nationality} · {careerSpan}
        </Eyebrow>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
          <Display as="h1" size="lg">
            {driver.fullName}
          </Display>
          <FavoriteButton
            entityType="driver"
            entityId={driver.id}
            initialFavorited={saved}
            signedIn={Boolean(user)}
          />
        </div>

        {driver.championships ? (
          <p className="text-primary mt-6 font-mono text-sm tracking-[0.16em] uppercase">
            {driver.championships}× World Champion
          </p>
        ) : null}

        {/*
          Only the title years among seeded seasons, which is usually fewer than the career
          total above. Saying so avoids reading as a contradiction.
        */}
        {titleYears.length > 0 ? (
          <p className="text-muted-foreground mt-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
            Title seasons in this archive ·{" "}
            {titleYears.map((r) => r.year).join(", ")}
          </p>
        ) : null}

        <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_2fr]">
          {/* Capped on narrow screens so an empty frame does not fill the viewport. */}
          <div className="border-border bg-card relative aspect-3/4 w-full max-w-xs border lg:max-w-none">
            {driver.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote host is not known until media lands
              <img
                src={driver.photoUrl}
                alt={driver.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground/50 absolute inset-0 flex items-center justify-center font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                No portrait yet
              </span>
            )}
          </div>

          <div>
            <Eyebrow>Career record</Eyebrow>
            <dl className="mt-6 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3">
              <Stat
                label="Championships"
                value={orDash(driver.championships)}
              />
              <Stat label="Wins" value={orDash(driver.wins)} />
              <Stat label="Poles" value={orDash(driver.poles)} />
              <Stat label="Podiums" value={orDash(driver.podiums)} />
              <Stat label="Starts" value={orDash(driver.raceStarts)} />
              <Stat
                label="Points"
                value={
                  driver.careerPoints === null
                    ? "—"
                    : formatPoints(driver.careerPoints)
                }
              />
            </dl>
            <p className="text-muted-foreground/70 mt-6 font-mono text-[0.6rem] tracking-[0.14em] uppercase">
              A dash means the archive has not verified that figure.
              Championship counts are taken from the season records; the rest
              await a verification pass.
            </p>

            {driver.bio ? (
              <p className="text-muted-foreground mt-8 leading-relaxed">
                {driver.bio}
              </p>
            ) : null}
          </div>
        </div>

        {timeline.length > 0 ? (
          <div className="mt-20">
            <Eyebrow>Career in this archive</Eyebrow>
            <ol className="mt-6">
              {timeline.map((entry) => (
                <li
                  key={`${entry.season.year}-${entry.team.slug}`}
                  className="border-border flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b py-6"
                >
                  <Link
                    href={`/seasons/${entry.season.year}`}
                    className="font-display hover:text-primary w-20 shrink-0 text-2xl font-light transition-colors"
                  >
                    {entry.season.year}
                  </Link>
                  <Link
                    href={`/teams/${entry.team.slug}`}
                    className="hover:text-primary flex-1 text-lg transition-colors"
                  >
                    {entry.team.name}
                  </Link>
                  {entry.car ? (
                    <Link
                      href={`/cars/${entry.car.slug}`}
                      className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors"
                    >
                      {entry.car.name}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground/50 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                      No car recorded
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="text-muted-foreground/70 mt-4 font-mono text-[0.6rem] tracking-[0.14em] uppercase">
              Seasons held in this archive, not the driver&apos;s full career
            </p>
          </div>
        ) : null}

        {standings.length > 0 ? (
          <div className="mt-20">
            <Eyebrow>Season finishes</Eyebrow>
            <table className="mt-6 w-full text-left">
              <thead>
                <tr className="text-muted-foreground border-border border-b font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                  <th scope="col" className="py-3 font-normal">
                    Season
                  </th>
                  <th scope="col" className="py-3 font-normal">
                    Team
                  </th>
                  <th scope="col" className="py-3 text-right font-normal">
                    Position
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
                {standings.map((row) => (
                  <tr key={row.season.year} className="border-border border-b">
                    <td className="py-4">
                      <Link
                        href={`/seasons/${row.season.year}`}
                        className="hover:text-primary transition-colors"
                      >
                        {row.season.year}
                      </Link>
                    </td>
                    <td className="py-4">
                      <Link
                        href={`/teams/${row.team.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {row.team.name}
                      </Link>
                    </td>
                    <td className="py-4 text-right font-mono text-sm">
                      {row.position}
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

        {teams.length > 0 ? (
          <div className="mt-20">
            <Eyebrow>Teams</Eyebrow>
            <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {teams.map((team) => (
                <li key={team.slug}>
                  <Link
                    href={`/teams/${team.slug}`}
                    className="font-display hover:text-primary text-xl font-light transition-colors"
                  >
                    {team.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-border mt-20 border-t pt-8">
          <Link
            href="/drivers"
            className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors"
          >
            All drivers
          </Link>
        </div>
      </Section>
    </Container>
  );
}
