import Link from "next/link";

import { Container, Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import type { ArchiveStats as ArchiveStatsData } from "@/lib/db/queries/archive";

/**
 * These describe the archive's own holdings, not Formula One as a whole. The heading says
 * so, because presenting a curated slice as the sport's totals would be a false claim.
 */
export function ArchiveStats({ stats }: { stats: ArchiveStatsData }) {
  const entries = [
    { label: "Cars", value: stats.cars, href: "/cars" },
    { label: "Drivers", value: stats.drivers, href: "/drivers" },
    { label: "Teams", value: stats.teams, href: "/teams" },
    { label: "Circuits", value: stats.circuits, href: "/circuits" },
    { label: "Seasons", value: stats.seasons, href: "/seasons" },
  ];

  return (
    <Section>
      <Container>
        <Eyebrow>In this archive</Eyebrow>

        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {entries.map((entry) => (
            <div key={entry.label}>
              <dt className="sr-only">{entry.label}</dt>
              <dd>
                <Link href={entry.href} className="group block">
                  <span className="font-display group-hover:text-primary block text-5xl leading-none font-light transition-colors">
                    {entry.value}
                  </span>
                  <span className="text-muted-foreground mt-3 block font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                    {entry.label}
                  </span>
                </Link>
              </dd>
            </div>
          ))}
        </dl>

        {stats.earliestYear && stats.latestYear ? (
          <p className="text-muted-foreground border-border mt-12 border-t pt-6 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
            Covering {stats.earliestYear} — {stats.latestYear}. A curated set,
            still growing.
          </p>
        ) : null}
      </Container>
    </Section>
  );
}
