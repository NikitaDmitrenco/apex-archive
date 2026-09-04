import Link from "next/link";

import { SectionHeader } from "@/components/archive/section-header";
import { Container, Section } from "@/components/ui/container";
import type { CarListItem } from "@/lib/db/queries/cars";
import { formatEngine } from "@/lib/format";

/**
 * An index rather than a card grid: these read as catalogue entries, which keeps the
 * sections on this page from collapsing into one repeated card shape.
 */
export function FeaturedCars({ cars }: { cars: CarListItem[] }) {
  if (cars.length === 0) return null;

  return (
    <Section className="border-border border-b">
      <Container>
        <SectionHeader
          eyebrow="Machines"
          title="Championship winners"
          href="/cars"
        />

        <ul>
          {cars.map((car, index) => (
            <li key={car.slug}>
              <Link
                href={`/cars/${car.slug}`}
                className="group border-border hover:bg-accent -mx-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b px-4 py-6 transition-colors"
              >
                <span className="text-muted-foreground w-8 shrink-0 font-mono text-[0.7rem]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display group-hover:text-primary flex-1 text-2xl font-light tracking-[-0.01em] transition-colors md:text-3xl">
                  {car.name}
                </span>
                <span className="text-muted-foreground w-full font-mono text-[0.7rem] tracking-[0.14em] uppercase sm:w-auto">
                  {car.year} · {car.teamName} ·{" "}
                  {formatEngine(car.engineConfig, car.capacityLiters)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
