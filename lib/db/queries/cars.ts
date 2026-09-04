import {
  and,
  asc,
  desc,
  eq,
  exists,
  gte,
  isNotNull,
  lte,
  sql,
} from "drizzle-orm";

import { findEra } from "@/lib/constants/eras";
import { db } from "@/lib/db";
import {
  cars,
  drivers,
  driverTeamSeasons,
  seasons,
  teams,
} from "@/lib/db/schema";
import { carFiltersSchema } from "@/lib/validation/filters";

export type CarListItem = {
  slug: string;
  name: string;
  year: number;
  teamName: string;
  teamSlug: string;
  engineManufacturer: string | null;
  engineConfig: string | null;
  capacityLiters: number | null;
  powerHp: number | null;
  imageUrl: string | null;
  dataConfidence: string;
};

export async function listCars(input: unknown = {}): Promise<CarListItem[]> {
  const filters = carFiltersSchema.parse(input);

  const conditions = [];

  if (filters.era) {
    const era = findEra(filters.era);
    // An unrecognised era slug narrows nothing rather than silently matching everything.
    if (!era) return [];
    conditions.push(gte(seasons.year, era.from));
    if (era.to) conditions.push(lte(seasons.year, era.to));
  }
  if (filters.teamSlug) conditions.push(eq(teams.slug, filters.teamSlug));
  if (filters.year) conditions.push(eq(seasons.year, filters.year));
  if (filters.yearFrom) conditions.push(gte(seasons.year, filters.yearFrom));
  if (filters.yearTo) conditions.push(lte(seasons.year, filters.yearTo));
  if (filters.decade) {
    conditions.push(gte(seasons.year, filters.decade));
    conditions.push(lte(seasons.year, filters.decade + 9));
  }
  if (filters.engineManufacturer) {
    conditions.push(eq(cars.engineManufacturer, filters.engineManufacturer));
  }
  if (filters.championshipWinning) {
    conditions.push(eq(seasons.constructorsChampionTeamId, cars.teamId));
  }
  if (filters.driverSlug) {
    conditions.push(
      exists(
        db
          .select({ one: sql`1` })
          .from(driverTeamSeasons)
          .innerJoin(drivers, eq(driverTeamSeasons.driverId, drivers.id))
          .where(
            and(
              eq(driverTeamSeasons.carId, cars.id),
              eq(drivers.slug, filters.driverSlug),
            ),
          ),
      ),
    );
  }

  return db
    .select({
      slug: cars.slug,
      name: cars.name,
      year: seasons.year,
      teamName: teams.name,
      teamSlug: teams.slug,
      engineManufacturer: cars.engineManufacturer,
      engineConfig: cars.engineConfig,
      capacityLiters: cars.capacityLiters,
      powerHp: cars.powerHp,
      imageUrl: cars.imageUrl,
      dataConfidence: cars.dataConfidence,
    })
    .from(cars)
    .innerJoin(teams, eq(cars.teamId, teams.id))
    .innerJoin(seasons, eq(cars.seasonId, seasons.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(seasons.year), asc(cars.name))
    .limit(filters.limit)
    .offset(filters.offset);
}

export async function listCarSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: cars.slug }).from(cars);
  return rows.map((row) => row.slug);
}

export async function getCarBySlug(slug: string) {
  return db.query.cars.findFirst({
    where: eq(cars.slug, slug),
    with: {
      team: true,
      season: true,
      driverTeamSeasons: { with: { driver: true } },
    },
  });
}

export type CarFilterOptions = {
  teams: { slug: string; name: string }[];
  engineManufacturers: string[];
  drivers: { slug: string; fullName: string }[];
  years: number[];
};

/**
 * Only values that actually match something are offered, so no choice in the filter bar can
 * lead to an empty catalogue on its own.
 */
export async function getCarFilterOptions(): Promise<CarFilterOptions> {
  const [teamRows, engineRows, driverRows, yearRows] = await Promise.all([
    db
      .selectDistinct({ slug: teams.slug, name: teams.name })
      .from(cars)
      .innerJoin(teams, eq(cars.teamId, teams.id))
      .orderBy(asc(teams.name)),
    db
      .selectDistinct({ value: cars.engineManufacturer })
      .from(cars)
      .where(isNotNull(cars.engineManufacturer))
      .orderBy(asc(cars.engineManufacturer)),
    db
      .selectDistinct({ slug: drivers.slug, fullName: drivers.fullName })
      .from(driverTeamSeasons)
      .innerJoin(drivers, eq(driverTeamSeasons.driverId, drivers.id))
      .where(isNotNull(driverTeamSeasons.carId))
      .orderBy(asc(drivers.fullName)),
    db
      .selectDistinct({ year: seasons.year })
      .from(cars)
      .innerJoin(seasons, eq(cars.seasonId, seasons.id))
      .orderBy(desc(seasons.year)),
  ]);

  return {
    teams: teamRows,
    engineManufacturers: engineRows
      .map((row) => row.value)
      .filter((value): value is string => value !== null),
    drivers: driverRows,
    years: yearRows.map((row) => row.year),
  };
}
