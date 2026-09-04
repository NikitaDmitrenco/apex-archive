import { and, asc, desc, eq, exists, gte, lte, sql } from "drizzle-orm";

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

export async function listEngineManufacturers(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ value: cars.engineManufacturer })
    .from(cars)
    .where(sql`${cars.engineManufacturer} is not null`)
    .orderBy(asc(cars.engineManufacturer));

  return rows.map((row) => row.value).filter((value) => value !== null);
}
