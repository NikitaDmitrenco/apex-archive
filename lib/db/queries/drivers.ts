import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { drivers, driverTeamSeasons, seasons, teams } from "@/lib/db/schema";
import { driverFiltersSchema } from "@/lib/validation/filters";

export type DriverListItem = {
  slug: string;
  fullName: string;
  nationality: string;
  careerStartYear: number | null;
  careerEndYear: number | null;
  championships: number | null;
  wins: number | null;
  photoUrl: string | null;
  dataConfidence: string;
};

export async function listDrivers(
  input: unknown = {},
): Promise<DriverListItem[]> {
  const filters = driverFiltersSchema.parse(input);

  const conditions = [];

  if (filters.nationality) {
    conditions.push(eq(drivers.nationality, filters.nationality));
  }
  if (filters.activeOnly) conditions.push(isNull(drivers.careerEndYear));
  if (filters.championsOnly) conditions.push(sql`${drivers.championships} > 0`);
  if (filters.teamSlug || filters.activeInYear) {
    const seasonConditions = [eq(driverTeamSeasons.driverId, drivers.id)];
    if (filters.teamSlug)
      seasonConditions.push(eq(teams.slug, filters.teamSlug));
    if (filters.activeInYear) {
      seasonConditions.push(eq(seasons.year, filters.activeInYear));
    }

    conditions.push(
      sql`exists ${db
        .select({ one: sql`1` })
        .from(driverTeamSeasons)
        .innerJoin(teams, eq(driverTeamSeasons.teamId, teams.id))
        .innerJoin(seasons, eq(driverTeamSeasons.seasonId, seasons.id))
        .where(and(...seasonConditions))}`,
    );
  }

  return db
    .select({
      slug: drivers.slug,
      fullName: drivers.fullName,
      nationality: drivers.nationality,
      careerStartYear: drivers.careerStartYear,
      careerEndYear: drivers.careerEndYear,
      championships: drivers.championships,
      wins: drivers.wins,
      photoUrl: drivers.photoUrl,
      dataConfidence: drivers.dataConfidence,
    })
    .from(drivers)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(drivers.championships), asc(drivers.fullName))
    .limit(filters.limit)
    .offset(filters.offset);
}

export async function getDriverBySlug(slug: string) {
  return db.query.drivers.findFirst({
    where: eq(drivers.slug, slug),
    with: {
      driverTeamSeasons: {
        with: { team: true, season: true, car: true },
      },
      driverStandings: {
        with: { season: true, team: true },
      },
    },
  });
}

/** Seasons a driver won, taken from the season record rather than counted from results. */
export async function getDriverChampionshipSeasons(driverId: string) {
  return db
    .select({ year: seasons.year })
    .from(seasons)
    .where(eq(seasons.worldChampionDriverId, driverId))
    .orderBy(asc(seasons.year));
}

export async function listDriverNationalities(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ value: drivers.nationality })
    .from(drivers)
    .orderBy(asc(drivers.nationality));

  return rows.map((row) => row.value);
}
