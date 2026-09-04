import Link from "next/link";

import { SectionHeader } from "@/components/archive/section-header";
import { Container, Section } from "@/components/ui/container";
import type { DriverListItem } from "@/lib/db/queries/drivers";

export function LegendaryDrivers({ drivers }: { drivers: DriverListItem[] }) {
  if (drivers.length === 0) return null;

  return (
    <Section className="border-border border-b">
      <Container>
        <SectionHeader
          eyebrow="Drivers"
          title="World champions"
          href="/drivers"
        />

        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => (
            <Link
              key={driver.slug}
              href={`/drivers/${driver.slug}`}
              className="group border-border flex items-start justify-between gap-6 border-b pb-6"
            >
              <span>
                <span className="font-display group-hover:text-primary block text-2xl font-light transition-colors">
                  {driver.fullName}
                </span>
                <span className="text-muted-foreground mt-2 block font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                  {driver.nationality}
                </span>
              </span>
              <span className="text-right">
                <span className="font-display block text-4xl leading-none font-light">
                  {driver.championships}
                </span>
                <span className="text-muted-foreground mt-2 block font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                  {driver.championships === 1 ? "Title" : "Titles"}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
