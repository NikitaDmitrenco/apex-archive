import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { cars } from "@/lib/db/schema";

/**
 * Shape used by the /compare route. Driver names and slugs are parallel arrays sorted by
 * full name — the comparison view zips them so each driver renders as a link.
 */
export type ComparisonCar = {
  slug: string;
  name: string;
  year: number;
  teamName: string;
  teamSlug: string;
  engineManufacturer: string | null;
  engineConfig: string | null;
  capacityLiters: number | null;
  powerHp: number | null;
  weightKg: number | null;
  /**
   * True when the team's car in that season was the constructors' champion. This is per
   * season rather than per career: a car that won once shows as "Yes · YEAR".
   */
  championshipWinning: boolean;
  driverNames: string[];
  driverSlugs: string[];
};

async function fetchComparisonCar(slug: string): Promise<ComparisonCar | null> {
  const row = await db.query.cars.findFirst({
    where: eq(cars.slug, slug),
    with: {
      team: true,
      season: true,
      driverTeamSeasons: { with: { driver: true } },
    },
  });

  if (!row) return null;

  // Dedup on the driver id: the same person can be linked to the car through more than one
  // season. Sorted by full name so the comparison reads the same on both sides.
  const driverEntries = Array.from(
    new Map(
      row.driverTeamSeasons
        .filter((link) => link.driver)
        .map((link) => [link.driver!.id, link.driver!]),
    ).values(),
  ).sort((a, b) => a.fullName.localeCompare(b.fullName));

  return {
    slug: row.slug,
    name: row.name,
    year: row.season.year,
    teamName: row.team.name,
    teamSlug: row.team.slug,
    engineManufacturer: row.engineManufacturer,
    engineConfig: row.engineConfig,
    capacityLiters: row.capacityLiters,
    powerHp: row.powerHp,
    weightKg: row.weightKg,
    championshipWinning: row.season.constructorsChampionTeamId === row.teamId,
    driverNames: driverEntries.map((driver) => driver.fullName),
    driverSlugs: driverEntries.map((driver) => driver.slug),
  };
}

/**
 * Resolves two car slugs to their comparison rows. A null entry means the slug did not
 * resolve — the page is responsible for showing the form rather than a partial comparison.
 */
export async function getCarsForComparison(
  a: string,
  b: string,
): Promise<[ComparisonCar | null, ComparisonCar | null]> {
  const [carA, carB] = await Promise.all([
    fetchComparisonCar(a),
    fetchComparisonCar(b),
  ]);
  return [carA, carB];
}
