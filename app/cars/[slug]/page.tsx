import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow } from "@/components/ui/typography";
import { getCarBySlug, listCarSlugs, listCars } from "@/lib/db/queries/cars";
import { orDash } from "@/lib/format";

/**
 * Every car in the archive is prerendered and anything else is refused by the router.
 *
 * Rendering unknown slugs on demand produced a soft 404: async metadata makes the response
 * stream, so the 200 status is already sent by the time the page reaches notFound(), and
 * the correct not-found body arrives under the wrong status code. Refusing at the routing
 * layer returns a real 404. The trade is that a newly seeded car needs a rebuild to appear.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await listCarSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/cars/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) return { title: "Car not found" };

  return {
    title: car.name,
    description: `${car.name}, run by ${car.team.name} in ${car.season.year}. Specifications and related entries in the Apex Archive.`,
  };
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border flex items-baseline justify-between gap-6 border-b py-4">
      <dt className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
        {label}
      </dt>
      <dd className="text-right font-mono text-sm">{value}</dd>
    </div>
  );
}

export default async function CarDetailPage({
  params,
}: PageProps<"/cars/[slug]">) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) notFound();

  const drivers = car.driverTeamSeasons
    .filter((link) => link.driver)
    .map((link) => link.driver);

  const wonConstructors = car.season.constructorsChampionTeamId === car.teamId;
  const championDriver = drivers.find(
    (driver) => driver.id === car.season.worldChampionDriverId,
  );

  const teamCars = await listCars({ teamSlug: car.team.slug, limit: 12 });
  const related = teamCars
    .filter((entry) => entry.slug !== car.slug)
    .slice(0, 3);

  const breakdown = car.technicalBreakdown;
  const breakdownEntries = (
    breakdown
      ? ([
          ["Chassis", breakdown.chassis],
          ["Front wing", breakdown.frontWing],
          ["Rear wing", breakdown.rearWing],
          ["Suspension", breakdown.suspension],
          ["Engine", breakdown.engine],
          ["Tyres", breakdown.tyres],
        ] satisfies [string, string | undefined][])
      : []
  ).filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <Container>
      <Section>
        <Eyebrow>
          <Link
            href={`/teams/${car.team.slug}`}
            className="hover:text-foreground"
          >
            {car.team.name}
          </Link>
          {" · "}
          <Link
            href={`/seasons/${car.season.year}`}
            className="hover:text-foreground"
          >
            {car.season.year}
          </Link>
        </Eyebrow>

        <Display as="h1" size="lg" className="mt-6">
          {car.name}
        </Display>

        <div className="border-border bg-card relative mt-12 aspect-21/9 border">
          {car.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote host is not known until media lands
            <img
              src={car.imageUrl}
              alt={`${car.name}, ${car.season.year}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground/50 absolute inset-0 flex items-center justify-center font-mono text-[0.65rem] tracking-[0.14em] uppercase">
              No image yet
            </span>
          )}
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[2fr_1fr]">
          <div>
            <Eyebrow>Specification</Eyebrow>
            <dl className="mt-6">
              <SpecRow label="Chassis" value={orDash(car.chassisName)} />
              <SpecRow label="Engine" value={orDash(car.engineManufacturer)} />
              <SpecRow label="Configuration" value={orDash(car.engineConfig)} />
              <SpecRow
                label="Capacity"
                value={
                  car.capacityLiters
                    ? `${car.capacityLiters.toFixed(1)} L`
                    : "—"
                }
              />
              <SpecRow
                label="Power"
                value={car.powerHp ? `~${car.powerHp} hp` : "—"}
              />
              <SpecRow
                label="Weight"
                value={car.weightKg ? `${car.weightKg} kg` : "—"}
              />
            </dl>
            <p className="text-muted-foreground/70 mt-4 font-mono text-[0.6rem] tracking-[0.14em] uppercase">
              A dash means the archive has not verified that figure
            </p>
          </div>

          <div>
            <Eyebrow>Championship</Eyebrow>
            <div className="mt-6 space-y-4">
              <p className="leading-relaxed">
                {wonConstructors
                  ? `${car.team.name} took the constructors' championship in ${car.season.year}.`
                  : `${car.team.name} did not take the constructors' championship in ${car.season.year}.`}
              </p>
              {championDriver ? (
                <p className="leading-relaxed">
                  <Link
                    href={`/drivers/${championDriver.slug}`}
                    className="hover:text-primary underline-offset-4 transition-colors hover:underline"
                  >
                    {championDriver.fullName}
                  </Link>{" "}
                  won the drivers&apos; championship in this car.
                </p>
              ) : null}
            </div>

            {drivers.length > 0 ? (
              <>
                <Eyebrow className="mt-12">Drivers</Eyebrow>
                <ul className="mt-6 space-y-3">
                  {drivers.map((driver) => (
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
              </>
            ) : null}
          </div>
        </div>

        <div className="mt-20">
          <Eyebrow>Technical breakdown</Eyebrow>
          {breakdownEntries.length > 0 ? (
            <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {breakdownEntries.map(([label, text]) => (
                <div key={label} className="border-border border-t pt-5">
                  <h3 className="font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                    {label}
                  </h3>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground border-border mt-8 border-t pt-6 leading-relaxed">
              No technical breakdown recorded for this car yet. Manufacturers
              rarely publish component detail, and the archive would rather show
              nothing than a plausible invention.
            </p>
          )}
        </div>

        {related.length > 0 ? (
          <div className="mt-20">
            <Eyebrow>More from {car.team.name}</Eyebrow>
            <ul className="mt-6">
              {related.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/cars/${entry.slug}`}
                    className="group border-border hover:bg-accent -mx-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b px-4 py-5 transition-colors"
                  >
                    <span className="font-display group-hover:text-primary text-xl font-light transition-colors">
                      {entry.name}
                    </span>
                    <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                      {entry.year}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-border mt-20 border-t pt-8">
          <Link
            href="/cars"
            className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors"
          >
            All cars
          </Link>
        </div>
      </Section>
    </Container>
  );
}
