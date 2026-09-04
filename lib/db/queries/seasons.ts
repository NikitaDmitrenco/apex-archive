import { and, asc, desc, eq, gte, lte } from "drizzle-orm";

import { db } from "@/lib/db";
import { seasons } from "@/lib/db/schema";
import { seasonFiltersSchema } from "@/lib/validation/filters";

export type SeasonListItem = {
  year: number;
  worldChampionDriverId: string | null;
  constructorsChampionTeamId: string | null;
  summary: string | null;
  dataConfidence: string;
};

export async function listSeasons(
  input: unknown = {},
): Promise<SeasonListItem[]> {
  const filters = seasonFiltersSchema.parse(input);

  const conditions = [];

  if (filters.yearFrom) conditions.push(gte(seasons.year, filters.yearFrom));
  if (filters.yearTo) conditions.push(lte(seasons.year, filters.yearTo));
  if (filters.decade) {
    conditions.push(gte(seasons.year, filters.decade));
    conditions.push(lte(seasons.year, filters.decade + 9));
  }

  return db
    .select({
      year: seasons.year,
      worldChampionDriverId: seasons.worldChampionDriverId,
      constructorsChampionTeamId: seasons.constructorsChampionTeamId,
      summary: seasons.summary,
      dataConfidence: seasons.dataConfidence,
    })
    .from(seasons)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(seasons.year))
    .limit(filters.limit)
    .offset(filters.offset);
}

export async function getSeasonByYear(year: number) {
  return db.query.seasons.findFirst({
    where: eq(seasons.year, year),
    with: {
      worldChampionDriver: true,
      constructorsChampionTeam: true,
      cars: { with: { team: true } },
      races: {
        with: { circuit: true, winnerDriver: true, winnerTeam: true },
      },
      driverStandings: { with: { driver: true, team: true } },
      constructorStandings: { with: { team: true } },
    },
  });
}

/** Years present in the archive, newest first — drives the seasons index and year filters. */
export async function listSeasonYears(): Promise<number[]> {
  const rows = await db
    .select({ year: seasons.year })
    .from(seasons)
    .orderBy(desc(seasons.year));

  return rows.map((row) => row.year);
}

export async function getEarliestAndLatestSeason() {
  const [earliest] = await db
    .select({ year: seasons.year })
    .from(seasons)
    .orderBy(asc(seasons.year))
    .limit(1);
  const [latest] = await db
    .select({ year: seasons.year })
    .from(seasons)
    .orderBy(desc(seasons.year))
    .limit(1);

  return { earliest: earliest?.year ?? null, latest: latest?.year ?? null };
}
