import Link from "next/link";

import type { TeamListItem } from "@/lib/db/queries/teams";
import { orDash } from "@/lib/format";

function activeSpan(team: TeamListItem): string {
  if (team.foundedYear) {
    return `${team.foundedYear} — ${team.dissolvedYear ?? "Present"}`;
  }
  return team.dissolvedYear ? `Until ${team.dissolvedYear}` : orDash(null);
}

export function TeamCard({ team }: { team: TeamListItem }) {
  return (
    <article className="border-border border-t pt-6">
      <Link href={`/teams/${team.slug}`} className="group block">
        <div className="flex items-baseline justify-between gap-6">
          <h3 className="font-display group-hover:text-primary text-3xl font-light tracking-[-0.01em] transition-colors">
            {team.name}
          </h3>
          <span className="font-display shrink-0 text-4xl leading-none font-light">
            {orDash(team.championships)}
          </span>
        </div>

        <div className="text-muted-foreground mt-3 flex items-baseline justify-between gap-6 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          <span>
            {team.nationality} · {activeSpan(team)}
          </span>
          <span className="shrink-0">
            {team.championships === 1 ? "Title" : "Titles"}
          </span>
        </div>
      </Link>
    </article>
  );
}
