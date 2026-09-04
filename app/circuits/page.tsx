import type { Metadata } from "next";

import { CircuitCard } from "@/components/archive/circuit-card";
import { CircuitFilters } from "@/components/archive/circuit-filters";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import { listCircuitCountries, listCircuits } from "@/lib/db/queries/circuits";
import { listSeasonYears } from "@/lib/db/queries/seasons";
import { withoutBlanks } from "@/lib/search-params";
import { circuitFiltersSchema } from "@/lib/validation/filters";

export const metadata: Metadata = {
  title: "Circuits",
  description:
    "The circuits that have hosted Formula 1 — searchable by country and by the seasons in which they appeared on the calendar.",
};

export default async function CircuitsPage({
  searchParams,
}: PageProps<"/circuits">) {
  const parsed = circuitFiltersSchema.safeParse(
    withoutBlanks(await searchParams),
  );
  const filters = parsed.success ? parsed.data : circuitFiltersSchema.parse({});

  const [circuits, countries, years] = await Promise.all([
    listCircuits(filters),
    listCircuitCountries(),
    listSeasonYears(),
  ]);

  return (
    <Container>
      <Section>
        <Eyebrow>Archive</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          Circuits
        </Display>
        <Lede className="mt-8">
          The tracks themselves — layouts, lengths, turns, and the races they
          have held.
        </Lede>

        <div className="mt-14">
          <CircuitFilters
            options={{ countries, years }}
            selected={{
              country: filters.country,
              hostedInYear: filters.hostedInYear,
            }}
            resultCount={circuits.length}
          />
        </div>

        {circuits.length > 0 ? (
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {circuits.map((circuit) => (
              <CircuitCard key={circuit.slug} circuit={circuit} />
            ))}
          </div>
        ) : (
          <div className="border-border mt-14 border-t pt-12">
            <Display as="p" size="sm">
              Nothing matches those filters.
            </Display>
            <p className="text-muted-foreground mt-6 max-w-md leading-relaxed">
              The archive is a curated set rather than a complete record, so a
              combination that existed in the sport may still have no circuit
              here. Try widening one of the filters.
            </p>
          </div>
        )}
      </Section>
    </Container>
  );
}
