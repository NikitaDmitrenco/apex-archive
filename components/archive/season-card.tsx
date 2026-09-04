import Link from "next/link";

import type { SeasonCatalogRow } from "@/lib/db/queries/seasons";
import { orDash } from "@/lib/format";

/**
 * One row in the seasons catalogue. Editorial list-row shape, mirroring the team card: the
 * year is the visual anchor, the champion line carries the substance, and the editorial
 * summary (when present) sits underneath as a short lede.
 *
 * The year is the primary destination; the two champion names resolve to their own detail
 * pages so a reader can jump from a season in the index straight to the driver or team
 * that won it, without first detouring through the season page.
 */
export function SeasonCard({ season }: { season: SeasonCatalogRow }) {
  return (
    <article className="border-border group border-t pt-6">
      <h3 className="font-display text-4xl font-light tracking-[-0.01em]">
        <Link
          href={`/seasons/${season.year}`}
          className="group-hover:text-primary transition-colors"
        >
          {season.year}
        </Link>
      </h3>

      <div className="text-muted-foreground mt-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
        Drivers&apos; champion:{" "}
        {season.worldChampionSlug && season.worldChampionName ? (
          <Link
            href={`/drivers/${season.worldChampionSlug}`}
            className="hover:text-foreground transition-colors"
          >
            {season.worldChampionName}
          </Link>
        ) : (
          orDash(season.worldChampionName)
        )}
        {" · "}
        Constructors&apos; champion:{" "}
        {season.constructorsChampionSlug && season.constructorsChampionName ? (
          <Link
            href={`/teams/${season.constructorsChampionSlug}`}
            className="hover:text-foreground transition-colors"
          >
            {season.constructorsChampionName}
          </Link>
        ) : (
          orDash(season.constructorsChampionName)
        )}
      </div>

      {season.summary ? (
        <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
          {season.summary}
        </p>
      ) : null}
    </article>
  );
}
