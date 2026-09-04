import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

export type ArchiveStats = {
  cars: number;
  drivers: number;
  teams: number;
  circuits: number;
  seasons: number;
  earliestYear: number | null;
  latestYear: number | null;
};

/**
 * Counts what the archive actually holds. These describe this collection, not the sport —
 * the archive covers a curated slice, so labelling them as totals for Formula One would be
 * a false claim.
 *
 * Gathered in one round trip rather than a query per table: the pooled connection is the
 * scarce resource here, not the work each count does.
 */
export async function getArchiveStats(): Promise<ArchiveStats> {
  const rows = await db.execute(sql`
    select
      (select count(*) from cars)::int      as cars,
      (select count(*) from drivers)::int   as drivers,
      (select count(*) from teams)::int     as teams,
      (select count(*) from circuits)::int  as circuits,
      (select count(*) from seasons)::int   as seasons,
      (select min(year) from seasons)::int  as earliest_year,
      (select max(year) from seasons)::int  as latest_year
  `);

  const row = rows[0] as Record<string, number | null> | undefined;

  return {
    cars: row?.cars ?? 0,
    drivers: row?.drivers ?? 0,
    teams: row?.teams ?? 0,
    circuits: row?.circuits ?? 0,
    seasons: row?.seasons ?? 0,
    earliestYear: row?.earliest_year ?? null,
    latestYear: row?.latest_year ?? null,
  };
}
