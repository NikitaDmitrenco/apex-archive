import type { Metadata } from "next";

import { CarCard } from "@/components/archive/car-card";
import { CarFilters } from "@/components/archive/car-filters";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import { getCarFilterOptions, listCars } from "@/lib/db/queries/cars";
import { withoutBlanks } from "@/lib/search-params";
import { carFiltersSchema } from "@/lib/validation/filters";

export const metadata: Metadata = {
  title: "Cars",
};

export default async function CarsPage({ searchParams }: PageProps<"/cars">) {
  const parsed = carFiltersSchema.safeParse(withoutBlanks(await searchParams));

  // A malformed query string falls back to the unfiltered catalogue instead of erroring.
  const filters = parsed.success ? parsed.data : carFiltersSchema.parse({});

  const [cars, options] = await Promise.all([
    listCars(filters),
    getCarFilterOptions(),
  ]);

  return (
    <Container>
      <Section>
        <Eyebrow>Archive</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          Cars
        </Display>
        <Lede className="mt-8">
          Every machine in the archive, by era, team, engine and championship
          record.
        </Lede>

        <div className="mt-14">
          <CarFilters
            options={options}
            selected={{
              era: filters.era,
              decade: filters.decade,
              teamSlug: filters.teamSlug,
              year: filters.year,
              engineManufacturer: filters.engineManufacturer,
              driverSlug: filters.driverSlug,
              championshipWinning: filters.championshipWinning,
            }}
            resultCount={cars.length}
          />
        </div>

        {cars.length > 0 ? (
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.slug} car={car} />
            ))}
          </div>
        ) : (
          <div className="border-border mt-14 border-t pt-12">
            <Display as="p" size="sm">
              Nothing matches those filters.
            </Display>
            <p className="text-muted-foreground mt-6 max-w-md leading-relaxed">
              The archive is a curated set rather than a complete record, so a
              combination that existed in the sport may still have no car here.
              Try widening one of the filters.
            </p>
          </div>
        )}
      </Section>
    </Container>
  );
}
