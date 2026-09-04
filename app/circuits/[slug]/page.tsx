import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow } from "@/components/ui/typography";
import { getCircuitBySlug, listCircuitSlugs } from "@/lib/db/queries/circuits";
import { orDash } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";

/**
 * Same reasoning as the other detail pages: refusing at the routing layer returns a real
 * 404 for unknown slugs rather than streaming a 200 with a fallback body.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await listCircuitSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/circuits/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const circuit = await getCircuitBySlug(slug);

  if (!circuit) return { title: "Circuit not found" };

  return buildMetadata({
    title: circuit.name,
    description: `${circuit.name}, ${circuit.country}. Layout, length, lap record and race history in the Apex Archive.`,
    path: `/circuits/${circuit.slug}`,
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

function lengthLabel(value: number | null): string {
  return value === null ? orDash(null) : `${value.toFixed(3)} km`;
}

export default async function CircuitDetailPage({
  params,
}: PageProps<"/circuits/[slug]">) {
  const { slug } = await params;
  const circuit = await getCircuitBySlug(slug);

  if (!circuit) notFound();

  // Newest first: a circuit reads better backwards from the most recent race.
  const races = [...circuit.races].sort(
    (a, b) => b.season.year - a.season.year,
  );
  const relatedYears = Array.from(
    new Set(races.map((race) => race.season.year)),
  ).sort((a, b) => b - a);

  return (
    <Container>
      <Section>
        <Eyebrow>
          {circuit.country}
          {circuit.location ? ` · ${circuit.location}` : ""}
        </Eyebrow>

        <Display as="h1" size="lg" className="mt-6">
          {circuit.name}
        </Display>

        <div className="border-border bg-card relative mt-12 aspect-16/9 border">
          {circuit.layoutImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote host is not known until media lands
            <img
              src={circuit.layoutImageUrl}
              alt={`${circuit.name} layout`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground/50 absolute inset-0 flex items-center justify-center font-mono text-[0.65rem] tracking-[0.14em] uppercase">
              No layout yet
            </span>
          )}
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
          <Stat label="Length" value={lengthLabel(circuit.lengthKm)} />
          <Stat label="Turns" value={orDash(circuit.turns)} />
          <Stat label="Laps" value={orDash(circuit.lapsStandard)} />
          <Stat label="First GP" value={orDash(circuit.firstGpYear)} />
        </dl>
        <p className="text-muted-foreground/70 mt-6 font-mono text-[0.6rem] tracking-[0.14em] uppercase">
          A dash means the archive has not verified that figure
        </p>

        {circuit.lapRecordTime ? (
          <div className="mt-16">
            <Eyebrow>Lap record</Eyebrow>
            <p className="font-display mt-6 text-3xl font-light">
              {circuit.lapRecordTime}
            </p>
            <p className="text-muted-foreground mt-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
              {circuit.lapRecordHolder ? (
                <>
                  Set by{" "}
                  <Link
                    href={`/drivers/${circuit.lapRecordHolder.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {circuit.lapRecordHolder.fullName}
                  </Link>
                  {circuit.lapRecordYear ? ` in ${circuit.lapRecordYear}` : ""}
                </>
              ) : (
                <>
                  Holder not recorded
                  {circuit.lapRecordYear ? ` · ${circuit.lapRecordYear}` : ""}
                </>
              )}
            </p>
          </div>
        ) : null}

        <div className="mt-20">
          <Eyebrow>Race history</Eyebrow>
          {races.length > 0 ? (
            <ol className="mt-6">
              {races.map((race) => (
                <li
                  key={`${race.season.year}-${race.roundNumber}`}
                  className="border-border flex flex-wrap items-baseline gap-x-8 gap-y-2 border-b py-6"
                >
                  <Link
                    href={`/seasons/${race.season.year}`}
                    className="font-display hover:text-primary w-20 shrink-0 text-2xl font-light transition-colors"
                  >
                    {race.season.year}
                  </Link>
                  <span className="text-muted-foreground w-12 shrink-0 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                    R{race.roundNumber}
                  </span>
                  <span className="flex-1 text-lg">{race.name}</span>
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
                  {race.winnerTeam ? (
                    <Link
                      href={`/teams/${race.winnerTeam.slug}`}
                      className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors"
                    >
                      {race.winnerTeam.name}
                    </Link>
                  ) : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-muted-foreground border-border mt-8 border-t pt-6 leading-relaxed">
              The archive does not hold race results for this circuit yet.
              Seeding races is a separate verification task; the page would
              rather show nothing than a plausible invention.
            </p>
          )}
        </div>

        {relatedYears.length > 0 ? (
          <div className="mt-20">
            <Eyebrow>Related seasons</Eyebrow>
            <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
              {relatedYears.map((year) => (
                <li key={year}>
                  <Link
                    href={`/seasons/${year}`}
                    className="font-display hover:text-primary text-xl font-light transition-colors"
                  >
                    {year}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-border mt-20 border-t pt-8">
          <Link
            href="/circuits"
            className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors"
          >
            All circuits
          </Link>
        </div>
      </Section>
    </Container>
  );
}
