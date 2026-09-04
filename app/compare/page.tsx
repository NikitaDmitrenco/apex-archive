import type { Metadata } from "next";
import Link from "next/link";
import { type ReactNode } from "react";

import { ComparisonForm } from "@/components/archive/comparison-form";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import {
  type ComparisonCar,
  getCarsForComparison,
} from "@/lib/db/queries/comparison";
import { listCars } from "@/lib/db/queries/cars";
import { orDash } from "@/lib/format";

/**
 * Read scalar search params safely: a query string can repeat a key, in which case the
 * value is an array. The form only ever sends one of each, so taking the first occurrence
 * keeps this page robust against `?a=a&a=b` or other malformed input.
 */
function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/compare">): Promise<Metadata> {
  const params = await searchParams;
  const a = firstParam(params.a);
  const b = firstParam(params.b);

  if (a && b) {
    const [carA, carB] = await getCarsForComparison(a, b);
    if (carA && carB) {
      return { title: `${carA.name} vs ${carB.name}` };
    }
  }

  return { title: "Compare cars" };
}

function formatCapacity(value: number | null): string {
  return value === null ? orDash(null) : `${value.toFixed(1)} L`;
}

function formatPower(value: number | null): string {
  return value === null ? orDash(null) : `~${value} hp`;
}

function formatWeight(value: number | null): string {
  return value === null ? orDash(null) : `${value} kg`;
}

/**
 * For a numeric comparison like power or weight, returns which side has the "better" value
 * per the direction. Both null → no winner. Equal → no winner. One null → no winner (a
 * dash cannot beat a number, and a number does not beat a dash).
 */
function numericBadge(
  a: number | null,
  b: number | null,
  direction: "higher" | "lower",
): ["higher" | "lower" | null, "higher" | "lower" | null] {
  if (a === null || b === null) return [null, null];
  if (a === b) return [null, null];
  if (direction === "higher") {
    return a > b ? ["higher", null] : [null, "higher"];
  }
  return a < b ? ["lower", null] : [null, "lower"];
}

function HigherLowerBadge({ direction }: { direction: "higher" | "lower" }) {
  return (
    <span className="text-primary ml-3 align-baseline font-mono text-[0.65rem] tracking-[0.14em] uppercase">
      {direction === "higher" ? "Higher" : "Lower"}
    </span>
  );
}

function ValueCell({
  children,
  badge,
}: {
  children: ReactNode;
  badge?: "higher" | "lower" | null;
}) {
  return (
    <dd className="font-display text-2xl leading-none font-light lg:text-3xl">
      <span>{children}</span>
      {badge ? <HigherLowerBadge direction={badge} /> : null}
    </dd>
  );
}

function ComparisonRow({
  label,
  a,
  b,
  aBadge,
  bBadge,
}: {
  label: string;
  a: ReactNode;
  b: ReactNode;
  aBadge?: "higher" | "lower" | null;
  bBadge?: "higher" | "lower" | null;
}) {
  return (
    <div className="border-border grid grid-cols-1 gap-y-3 border-b py-6 lg:grid-cols-[12rem_1fr_1fr] lg:items-baseline lg:gap-x-10">
      <dt className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
        {label}
      </dt>
      <ValueCell badge={aBadge}>{a}</ValueCell>
      <ValueCell badge={bBadge}>{b}</ValueCell>
    </div>
  );
}

function renderDrivers(car: ComparisonCar): ReactNode {
  if (car.driverNames.length === 0) return orDash(null);
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-1">
      {car.driverNames.map((name, index) => (
        <Link
          key={car.driverSlugs[index]}
          href={`/drivers/${car.driverSlugs[index]}`}
          className="hover:text-primary transition-colors"
        >
          {name}
        </Link>
      ))}
    </span>
  );
}

function renderChampionship(car: ComparisonCar): ReactNode {
  if (!car.championshipWinning) {
    return <span className="text-muted-foreground">No</span>;
  }
  return (
    <span>
      <span className="text-primary">Yes</span>
      <span className="text-muted-foreground ml-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
        · {car.year}
      </span>
    </span>
  );
}

function ComparisonView({ a, b }: { a: ComparisonCar; b: ComparisonCar }) {
  const [capacityA, capacityB] = numericBadge(
    a.capacityLiters,
    b.capacityLiters,
    "higher",
  );
  const [powerA, powerB] = numericBadge(a.powerHp, b.powerHp, "higher");
  const [weightA, weightB] = numericBadge(a.weightKg, b.weightKg, "lower");

  const showEngineManufacturer =
    a.engineManufacturer !== null || b.engineManufacturer !== null;
  const showEngineConfig = a.engineConfig !== null || b.engineConfig !== null;
  const showCapacity = a.capacityLiters !== null || b.capacityLiters !== null;
  const showPower = a.powerHp !== null || b.powerHp !== null;
  const showWeight = a.weightKg !== null || b.weightKg !== null;
  const showDrivers = a.driverNames.length > 0 || b.driverNames.length > 0;

  return (
    <div>
      <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
        <div>
          <Eyebrow>Car A</Eyebrow>
          <Display as="h2" size="md" className="mt-6">
            <Link
              href={`/cars/${a.slug}`}
              className="hover:text-primary transition-colors"
            >
              {a.name}
            </Link>
          </Display>
          <Link
            href={`/teams/${a.teamSlug}`}
            className="text-muted-foreground hover:text-foreground mt-4 inline-block font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors"
          >
            {a.teamName} · {a.year}
          </Link>
        </div>
        <div>
          <Eyebrow>Car B</Eyebrow>
          <Display as="h2" size="md" className="mt-6">
            <Link
              href={`/cars/${b.slug}`}
              className="hover:text-primary transition-colors"
            >
              {b.name}
            </Link>
          </Display>
          <Link
            href={`/teams/${b.teamSlug}`}
            className="text-muted-foreground hover:text-foreground mt-4 inline-block font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors"
          >
            {b.teamName} · {b.year}
          </Link>
        </div>
      </div>

      <dl className="border-border mt-16 border-t">
        <ComparisonRow label="Year" a={a.year} b={b.year} />
        <ComparisonRow
          label="Team"
          a={
            <Link
              href={`/teams/${a.teamSlug}`}
              className="hover:text-primary transition-colors"
            >
              {a.teamName}
            </Link>
          }
          b={
            <Link
              href={`/teams/${b.teamSlug}`}
              className="hover:text-primary transition-colors"
            >
              {b.teamName}
            </Link>
          }
        />
        <ComparisonRow
          label="Championship winner"
          a={renderChampionship(a)}
          b={renderChampionship(b)}
        />
        {showDrivers ? (
          <ComparisonRow
            label="Drivers"
            a={renderDrivers(a)}
            b={renderDrivers(b)}
          />
        ) : null}
        {showEngineManufacturer ? (
          <ComparisonRow
            label="Engine manufacturer"
            a={orDash(a.engineManufacturer)}
            b={orDash(b.engineManufacturer)}
          />
        ) : null}
        {showEngineConfig ? (
          <ComparisonRow
            label="Engine configuration"
            a={orDash(a.engineConfig)}
            b={orDash(b.engineConfig)}
          />
        ) : null}
        {showCapacity ? (
          <ComparisonRow
            label="Capacity"
            a={formatCapacity(a.capacityLiters)}
            b={formatCapacity(b.capacityLiters)}
            aBadge={capacityA}
            bBadge={capacityB}
          />
        ) : null}
        {showPower ? (
          <ComparisonRow
            label="Power"
            a={formatPower(a.powerHp)}
            b={formatPower(b.powerHp)}
            aBadge={powerA}
            bBadge={powerB}
          />
        ) : null}
        {showWeight ? (
          <ComparisonRow
            label="Weight"
            a={formatWeight(a.weightKg)}
            b={formatWeight(b.weightKg)}
            aBadge={weightA}
            bBadge={weightB}
          />
        ) : null}
      </dl>

      <div className="border-border mt-16 border-t pt-8">
        <Link
          href="/compare"
          className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors"
        >
          Choose another pair
        </Link>
      </div>
    </div>
  );
}

export default async function ComparePage({
  searchParams,
}: PageProps<"/compare">) {
  const params = await searchParams;
  const a = firstParam(params.a);
  const b = firstParam(params.b);

  const [pair, allCars] = await Promise.all([
    a && b
      ? getCarsForComparison(a, b)
      : Promise.resolve([null, null] as const),
    listCars({ limit: 200 }),
  ]);
  const [carA, carB] = pair;

  if (carA && carB) {
    return (
      <Container>
        <Section>
          <Eyebrow>Compare</Eyebrow>
          <Display as="h1" size="lg" className="mt-6">
            {carA.name} <span className="text-muted-foreground">vs</span>{" "}
            {carB.name}
          </Display>
          <Lede className="mt-8">
            A side-by-side reading of the same attributes across two machines. A
            HIGHER or LOWER badge marks a numeric winner where one exists.
          </Lede>

          <div className="mt-16">
            <ComparisonView a={carA} b={carB} />
          </div>
        </Section>
      </Container>
    );
  }

  const bothInvalid = Boolean(a) && Boolean(b) && !carA && !carB;

  const formCars = allCars.map((car) => ({
    slug: car.slug,
    name: car.name,
    year: car.year,
    teamName: car.teamName,
  }));

  return (
    <Container>
      <Section>
        <Eyebrow>Compare</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          Compare cars
        </Display>
        <Lede className="mt-8">
          Pick two machines from the archive and place them side by side. The
          columns show the same attribute for each car — a HIGHER or LOWER badge
          marks the numeric winner where one exists.
        </Lede>

        <div className="mt-14">
          <ComparisonForm allCars={formCars} initialA={a} initialB={b} />
        </div>

        <p className="text-muted-foreground mt-10 max-w-2xl leading-relaxed">
          Comparison reads best when the cars come from different eras —
          regulation shifts, engine layouts and design philosophies are what
          make the contrast meaningful.
        </p>

        {bothInvalid ? (
          <p className="text-muted-foreground mt-6 max-w-2xl leading-relaxed">
            One or both of those cars weren&apos;t found in the archive. Pick
            new ones below.
          </p>
        ) : null}
      </Section>
    </Container>
  );
}
