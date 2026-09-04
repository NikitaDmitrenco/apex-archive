import type { Metadata } from "next";

import { DriverCard } from "@/components/archive/driver-card";
import { DriverFilters } from "@/components/archive/driver-filters";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import { getDriverFilterOptions, listDrivers } from "@/lib/db/queries/drivers";
import { driverFiltersSchema } from "@/lib/validation/filters";
import { withoutBlanks } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Drivers",
  description:
    "The drivers of Formula 1 in the Apex Archive — filterable by nationality, team, active years and championship record.",
};

export default async function DriversPage({
  searchParams,
}: PageProps<"/drivers">) {
  const parsed = driverFiltersSchema.safeParse(
    withoutBlanks(await searchParams),
  );
  const filters = parsed.success ? parsed.data : driverFiltersSchema.parse({});

  const [drivers, options] = await Promise.all([
    listDrivers(filters),
    getDriverFilterOptions(),
  ]);

  return (
    <Container>
      <Section>
        <Eyebrow>Archive</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          Drivers
        </Display>
        <Lede className="mt-8">
          The people who drove the machines, from the first championship season
          to the present day.
        </Lede>

        <div className="mt-14">
          <DriverFilters
            options={options}
            selected={{
              nationality: filters.nationality,
              teamSlug: filters.teamSlug,
              activeInYear: filters.activeInYear,
              activeOnly: filters.activeOnly,
              championsOnly: filters.championsOnly,
            }}
            resultCount={drivers.length}
          />
        </div>

        {drivers.length > 0 ? (
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {drivers.map((driver) => (
              <DriverCard key={driver.slug} driver={driver} />
            ))}
          </div>
        ) : (
          <div className="border-border mt-14 border-t pt-12">
            <Display as="p" size="sm">
              No drivers match those filters.
            </Display>
            <p className="text-muted-foreground mt-6 max-w-md leading-relaxed">
              The archive is a curated set rather than a complete record, so a
              driver who raced in the sport may still have no entry here. Try
              widening one of the filters.
            </p>
          </div>
        )}
      </Section>
    </Container>
  );
}
