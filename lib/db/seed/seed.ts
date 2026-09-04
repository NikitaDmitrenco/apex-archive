import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  cars,
  circuits,
  constructorStandings,
  driverStandings,
  drivers,
  driverTeamSeasons,
  seasons,
  teams,
} from "../schema";
import {
  seedCars,
  seedCircuits,
  seedConstructorStandings,
  seedDrivers,
  seedDriverStandings,
  seedDriverTeamSeasons,
  seedSeasons,
  seedTeams,
} from "./data";

config({ path: ".env.local" });

const url = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!url) {
  console.error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.",
  );
  process.exit(1);
}

const client = postgres(url, { max: 1 });
const db = drizzle(client);

/** Re-running the seed refreshes rows in place rather than duplicating or failing. */
async function seed() {
  console.log("Seeding teams...");
  const teamRows = await db
    .insert(teams)
    .values(
      seedTeams.map((team) => ({
        slug: team.slug,
        name: team.name,
        nationality: team.nationality,
        foundedYear: team.foundedYear ?? null,
        dissolvedYear: team.dissolvedYear ?? null,
        baseLocation: team.baseLocation ?? null,
        bio: team.bio ?? null,
        championships: team.championships,
        dataConfidence: team.dataConfidence,
      })),
    )
    .onConflictDoUpdate({
      target: teams.slug,
      set: {
        name: sql`excluded.name`,
        nationality: sql`excluded.nationality`,
        foundedYear: sql`excluded.founded_year`,
        dissolvedYear: sql`excluded.dissolved_year`,
        baseLocation: sql`excluded.base_location`,
        bio: sql`excluded.bio`,
        championships: sql`excluded.championships`,
        dataConfidence: sql`excluded.data_confidence`,
        updatedAt: new Date(),
      },
    })
    .returning({ id: teams.id, slug: teams.slug });

  console.log("Seeding drivers...");
  const driverRows = await db
    .insert(drivers)
    .values(
      seedDrivers.map((driver) => ({
        slug: driver.slug,
        fullName: driver.fullName,
        nationality: driver.nationality,
        careerStartYear: driver.careerStartYear ?? null,
        careerEndYear: driver.careerEndYear ?? null,
        championships: driver.championships,
        dataConfidence: driver.dataConfidence,
      })),
    )
    .onConflictDoUpdate({
      target: drivers.slug,
      set: {
        fullName: sql`excluded.full_name`,
        nationality: sql`excluded.nationality`,
        careerStartYear: sql`excluded.career_start_year`,
        careerEndYear: sql`excluded.career_end_year`,
        championships: sql`excluded.championships`,
        dataConfidence: sql`excluded.data_confidence`,
        updatedAt: new Date(),
      },
    })
    .returning({ id: drivers.id, slug: drivers.slug });

  const teamIdBySlug = new Map(teamRows.map((row) => [row.slug, row.id]));
  const driverIdBySlug = new Map(driverRows.map((row) => [row.slug, row.id]));

  console.log("Seeding seasons...");
  const seasonRows = await db
    .insert(seasons)
    .values(
      seedSeasons.map((season) => ({
        year: season.year,
        worldChampionDriverId: season.worldChampionDriver
          ? requireId(driverIdBySlug, season.worldChampionDriver, "driver")
          : null,
        constructorsChampionTeamId: season.constructorsChampionTeam
          ? requireId(teamIdBySlug, season.constructorsChampionTeam, "team")
          : null,
        summary: season.summary ?? null,
        dataConfidence: season.dataConfidence,
      })),
    )
    .onConflictDoUpdate({
      target: seasons.year,
      set: {
        worldChampionDriverId: sql`excluded.world_champion_driver_id`,
        constructorsChampionTeamId: sql`excluded.constructors_champion_team_id`,
        summary: sql`excluded.summary`,
        dataConfidence: sql`excluded.data_confidence`,
        updatedAt: new Date(),
      },
    })
    .returning({ id: seasons.id, year: seasons.year });

  const seasonIdByYear = new Map(seasonRows.map((row) => [row.year, row.id]));

  console.log("Seeding circuits...");
  await db
    .insert(circuits)
    .values(
      seedCircuits.map((circuit) => ({
        slug: circuit.slug,
        name: circuit.name,
        country: circuit.country,
        location: circuit.location ?? null,
        lengthKm: circuit.lengthKm ?? null,
        lapsStandard: circuit.lapsStandard ?? null,
        dataConfidence: circuit.dataConfidence,
      })),
    )
    .onConflictDoUpdate({
      target: circuits.slug,
      set: {
        name: sql`excluded.name`,
        country: sql`excluded.country`,
        location: sql`excluded.location`,
        lengthKm: sql`excluded.length_km`,
        lapsStandard: sql`excluded.laps_standard`,
        dataConfidence: sql`excluded.data_confidence`,
        updatedAt: new Date(),
      },
    });

  console.log("Seeding cars...");
  const carRows = await db
    .insert(cars)
    .values(
      seedCars.map((car) => ({
        slug: car.slug,
        name: car.name,
        teamId: requireId(teamIdBySlug, car.team, "team"),
        seasonId: requireSeasonId(seasonIdByYear, car.year),
        chassisName: car.chassisName ?? null,
        engineManufacturer: car.engineManufacturer ?? null,
        engineConfig: car.engineConfig ?? null,
        capacityLiters: car.capacityLiters ?? null,
        dataConfidence: car.dataConfidence,
      })),
    )
    .onConflictDoUpdate({
      target: cars.slug,
      set: {
        name: sql`excluded.name`,
        teamId: sql`excluded.team_id`,
        seasonId: sql`excluded.season_id`,
        chassisName: sql`excluded.chassis_name`,
        engineManufacturer: sql`excluded.engine_manufacturer`,
        engineConfig: sql`excluded.engine_config`,
        capacityLiters: sql`excluded.capacity_liters`,
        dataConfidence: sql`excluded.data_confidence`,
        updatedAt: new Date(),
      },
    })
    .returning({ id: cars.id, slug: cars.slug });

  const carIdBySlug = new Map(carRows.map((row) => [row.slug, row.id]));

  console.log("Seeding standings...");
  await db
    .insert(driverStandings)
    .values(
      seedDriverStandings.map((standing) => ({
        seasonId: requireSeasonId(seasonIdByYear, standing.year),
        driverId: requireId(driverIdBySlug, standing.driver, "driver"),
        teamId: requireId(teamIdBySlug, standing.team, "team"),
        position: standing.position,
        points: standing.points,
        wins: standing.wins ?? null,
        dataConfidence: "verified" as const,
      })),
    )
    .onConflictDoUpdate({
      target: [driverStandings.seasonId, driverStandings.driverId],
      set: {
        teamId: sql`excluded.team_id`,
        position: sql`excluded.position`,
        points: sql`excluded.points`,
        wins: sql`excluded.wins`,
      },
    });

  await db
    .insert(constructorStandings)
    .values(
      seedConstructorStandings.map((standing) => ({
        seasonId: requireSeasonId(seasonIdByYear, standing.year),
        teamId: requireId(teamIdBySlug, standing.team, "team"),
        position: standing.position,
        points: standing.points,
        wins: standing.wins ?? null,
        dataConfidence: "verified" as const,
      })),
    )
    .onConflictDoUpdate({
      target: [constructorStandings.seasonId, constructorStandings.teamId],
      set: {
        position: sql`excluded.position`,
        points: sql`excluded.points`,
        wins: sql`excluded.wins`,
      },
    });

  console.log("Seeding driver/team/season links...");
  // Every driver in a standings table drove for that team that season, so the links are
  // derived rather than restated, which keeps the two from drifting apart.
  const links = [
    ...seedDriverTeamSeasons,
    ...seedDriverStandings.map((standing) => ({
      driver: standing.driver,
      team: standing.team,
      year: standing.year,
      car: undefined,
    })),
  ];

  await db
    .insert(driverTeamSeasons)
    .values(
      links.map((link) => ({
        driverId: requireId(driverIdBySlug, link.driver, "driver"),
        teamId: requireId(teamIdBySlug, link.team, "team"),
        seasonId: requireSeasonId(seasonIdByYear, link.year),
        carId: link.car ? requireId(carIdBySlug, link.car, "car") : null,
      })),
    )
    .onConflictDoNothing();

  console.log(
    `Done. ${teamRows.length} teams, ${driverRows.length} drivers, ${seasonRows.length} seasons, ${seedCircuits.length} circuits, ${carRows.length} cars, ${links.length} links, ${seedDriverStandings.length} driver standings, ${seedConstructorStandings.length} constructor standings.`,
  );
}

function requireId(map: Map<string, string>, slug: string, kind: string) {
  const id = map.get(slug);
  if (!id) throw new Error(`Seed references unknown ${kind}: ${slug}`);
  return id;
}

function requireSeasonId(map: Map<number, string>, year: number) {
  const id = map.get(year);
  if (!id) throw new Error(`Seed references unseeded season: ${year}`);
  return id;
}

seed()
  .then(() => client.end())
  .catch(async (error) => {
    console.error(error);
    await client.end();
    process.exit(1);
  });
