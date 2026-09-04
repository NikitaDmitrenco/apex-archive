import Link from "next/link";

import { SectionHeader } from "@/components/archive/section-header";
import { Container, Section } from "@/components/ui/container";
import type { CircuitListItem } from "@/lib/db/queries/circuits";
import type { TeamListItem } from "@/lib/db/queries/teams";
import { orDash } from "@/lib/format";

/** Skips any part the archive does not know, so a missing founding year leaves no stray separator. */
function teamMeta(team: TeamListItem): string {
  const period = team.foundedYear
    ? `${team.foundedYear} — ${team.dissolvedYear ?? "Present"}`
    : team.dissolvedYear
      ? `Until ${team.dissolvedYear}`
      : null;

  const titles =
    team.championships !== null
      ? `${team.championships} ${team.championships === 1 ? "title" : "titles"}`
      : null;

  return [period, titles].filter(Boolean).join(" · ");
}

export function Teams({ teams }: { teams: TeamListItem[] }) {
  if (teams.length === 0) return null;

  return (
    <Section className="border-border border-b">
      <Container>
        <SectionHeader eyebrow="Constructors" title="The teams" href="/teams" />

        <ul className="mt-2">
          {teams.map((team) => (
            <li key={team.slug}>
              <Link
                href={`/teams/${team.slug}`}
                className="group border-border hover:bg-accent -mx-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b px-4 py-5 transition-colors"
              >
                <span className="font-display group-hover:text-primary text-2xl font-light transition-colors">
                  {team.name}
                </span>
                <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                  {teamMeta(team)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

export function Circuits({ circuits }: { circuits: CircuitListItem[] }) {
  if (circuits.length === 0) return null;

  return (
    <Section className="border-border border-b">
      <Container>
        <SectionHeader eyebrow="Circuits" title="The tracks" href="/circuits" />

        <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {circuits.map((circuit) => (
            <Link
              key={circuit.slug}
              href={`/circuits/${circuit.slug}`}
              className="group border-border border-b pb-5"
            >
              <span className="font-display group-hover:text-primary block text-xl font-light transition-colors">
                {circuit.name}
              </span>
              <span className="text-muted-foreground mt-2 block font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                {circuit.country}
                {circuit.lengthKm ? ` · ${circuit.lengthKm} km` : ""}
                {circuit.turns ? ` · ${orDash(circuit.turns)} turns` : ""}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
