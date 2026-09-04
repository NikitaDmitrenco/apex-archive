import { and, asc, desc, eq, gte, lte } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  constructorStandings,
  driverStandings,
  drivers,
  seasons,
  teams,
} from "@/lib/db/schema";
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

export type DriverStandingRow = {
  position: number;
  driverName: string;
  driverSlug: string;
  teamName: string;
  teamSlug: string;
  points: number;
  wins: number | null;
};

export type ConstructorStandingRow = {
  position: number;
  teamName: string;
  teamSlug: string;
  points: number;
  wins: number | null;
};

/**
 * Standings for a season. Empty arrays mean the archive holds no standings for that year,
 * which is not the same as everyone scoring zero — callers must not render a blank table
 * as a result.
 */
export async function getSeasonStandings(year: number): Promise<{
  drivers: DriverStandingRow[];
  constructors: ConstructorStandingRow[];
}> {
  const season = await db.query.seasons.findFirst({
    where: eq(seasons.year, year),
    columns: { id: true },
  });

  if (!season) return { drivers: [], constructors: [] };

  const [driverRows, constructorRows] = await Promise.all([
    db
      .select({
        position: driverStandings.position,
        driverName: drivers.fullName,
        driverSlug: drivers.slug,
        teamName: teams.name,
        teamSlug: teams.slug,
        points: driverStandings.points,
        wins: driverStandings.wins,
      })
      .from(driverStandings)
      .innerJoin(drivers, eq(driverStandings.driverId, drivers.id))
      .innerJoin(teams, eq(driverStandings.teamId, teams.id))
      .where(eq(driverStandings.seasonId, season.id))
      .orderBy(asc(driverStandings.position)),
    db
      .select({
        position: constructorStandings.position,
        teamName: teams.name,
        teamSlug: teams.slug,
        points: constructorStandings.points,
        wins: constructorStandings.wins,
      })
      .from(constructorStandings)
      .innerJoin(teams, eq(constructorStandings.teamId, teams.id))
      .where(eq(constructorStandings.seasonId, season.id))
      .orderBy(asc(constructorStandings.position)),
  ]);

  return { drivers: driverRows, constructors: constructorRows };
}

/**
 * Row shape for the seasons catalogue: same fields as {@link SeasonListItem} but with the
 * champion names resolved, so the list page can render champion strings without a second
 * round-trip per row.
 */
export type SeasonCatalogRow = {
  year: number;
  summary: string | null;
  worldChampionName: string | null;
  worldChampionSlug: string | null;
  constructorsChampionName: string | null;
  constructorsChampionSlug: string | null;
  dataConfidence: string;
};

/**
 * Season list with champion names joined in. Same filters as {@link listSeasons}; the join
 * is `leftJoin` so a season with no recorded champion yet (the running season, for example)
 * still appears with nulls rather than dropping out of the catalogue.
 */
export async function listSeasonsForCatalog(
  input: unknown = {},
): Promise<SeasonCatalogRow[]> {
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
      summary: seasons.summary,
      worldChampionName: drivers.fullName,
      worldChampionSlug: drivers.slug,
      constructorsChampionName: teams.name,
      constructorsChampionSlug: teams.slug,
      dataConfidence: seasons.dataConfidence,
    })
    .from(seasons)
    .leftJoin(drivers, eq(seasons.worldChampionDriverId, drivers.id))
    .leftJoin(teams, eq(seasons.constructorsChampionTeamId, teams.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(seasons.year))
    .limit(filters.limit)
    .offset(filters.offset);
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
