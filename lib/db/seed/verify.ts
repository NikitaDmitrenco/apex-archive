import { config } from "dotenv";

config({ path: ".env.local" });

/**
 * Smoke test for the data access layer: calls every entity's list and detail query against
 * the real database and prints what comes back. Run with `npm run db:verify` after seeding.
 *
 * Queries are imported dynamically so dotenv has already populated process.env by the time
 * the database client module is evaluated.
 */
async function main() {
  const [
    carsQueries,
    driversQueries,
    teamsQueries,
    circuitsQueries,
    seasonsQueries,
  ] = await Promise.all([
    import("../queries/cars"),
    import("../queries/drivers"),
    import("../queries/teams"),
    import("../queries/circuits"),
    import("../queries/seasons"),
  ]);

  const cars = await carsQueries.listCars({ limit: 3 });
  console.log(`\nlistCars -> ${cars.length}`);
  console.table(
    cars.map((car) => ({
      slug: car.slug,
      year: car.year,
      team: car.teamName,
      engine: car.engineConfig,
      power: car.powerHp ?? "unknown",
    })),
  );

  const championshipCars = await carsQueries.listCars({
    championshipWinning: true,
    limit: 50,
  });
  console.log(
    `listCars championshipWinning -> ${championshipCars.length}:`,
    championshipCars.map((car) => `${car.year} ${car.name}`).join(", "),
  );

  const schumacherCars = await carsQueries.listCars({
    driverSlug: "michael-schumacher",
  });
  console.log(
    `listCars driverSlug=michael-schumacher -> ${schumacherCars.length}:`,
    schumacherCars.map((car) => car.name).join(", "),
  );

  const ferrariIn2004 = await carsQueries.listCars({
    teamSlug: "ferrari",
    year: 2004,
  });
  console.log(
    `listCars teamSlug=ferrari&year=2004 -> ${ferrariIn2004.length}:`,
    ferrariIn2004.map((car) => car.name).join(", "),
  );

  const f2004 = await carsQueries.getCarBySlug("ferrari-f2004");
  console.log(
    `\ngetCarBySlug(ferrari-f2004) -> ${f2004?.name}, team ${f2004?.team.name}, season ${f2004?.season.year}, drivers:`,
    f2004?.driverTeamSeasons.map((link) => link.driver.fullName).join(", "),
  );

  const missingCar = await carsQueries.getCarBySlug("does-not-exist");
  console.log(`getCarBySlug(does-not-exist) -> ${missingCar}`);

  const champions = await driversQueries.listDrivers({
    championsOnly: true,
    limit: 5,
  });
  console.log(
    `\nlistDrivers championsOnly (top 5 by titles) -> ${champions.length}`,
  );
  console.table(
    champions.map((driver) => ({
      name: driver.fullName,
      titles: driver.championships,
      wins: driver.wins ?? "unknown",
    })),
  );

  const activeDrivers = await driversQueries.listDrivers({ activeOnly: true });
  console.log(
    `listDrivers activeOnly -> ${activeDrivers.length}:`,
    activeDrivers.map((driver) => driver.fullName).join(", "),
  );

  const schumacher = await driversQueries.getDriverBySlug("michael-schumacher");
  console.log(
    `\ngetDriverBySlug(michael-schumacher) -> ${schumacher?.fullName}, ${schumacher?.championships} titles, seasons in archive:`,
    schumacher?.driverTeamSeasons
      .map((link) => `${link.season.year} ${link.team.name}`)
      .join(", "),
  );

  if (schumacher) {
    const titleYears = await driversQueries.getDriverChampionshipSeasons(
      schumacher.id,
    );
    console.log(
      "getDriverChampionshipSeasons ->",
      titleYears.map((row) => row.year).join(", "),
      "(seeded seasons only)",
    );
  }

  const teams = await teamsQueries.listTeams({ limit: 5 });
  console.log(`\nlistTeams -> ${teams.length}`);
  console.table(
    teams.map((team) => ({
      name: team.name,
      titles: team.championships,
      founded: team.foundedYear ?? "unknown",
      dissolved: team.dissolvedYear ?? "active",
    })),
  );

  const ferrari = await teamsQueries.getTeamBySlug("ferrari");
  console.log(
    `getTeamBySlug(ferrari) -> ${ferrari?.championships} titles, ${ferrari?.cars.length} cars in archive`,
  );

  const circuits = await circuitsQueries.listCircuits({ limit: 3 });
  console.log(`\nlistCircuits -> ${circuits.length}`);
  console.table(
    circuits.map((circuit) => ({
      name: circuit.name,
      country: circuit.country,
      km: circuit.lengthKm ?? "unknown",
      confidence: circuit.dataConfidence,
    })),
  );

  const monza = await circuitsQueries.getCircuitBySlug("monza");
  console.log(
    `getCircuitBySlug(monza) -> ${monza?.lengthKm} km, ${monza?.lapsStandard} laps, confidence ${monza?.dataConfidence}`,
  );

  const seasons = await seasonsQueries.listSeasons({ limit: 20 });
  console.log(`\nlistSeasons -> ${seasons.length}`);

  const season2004 = await seasonsQueries.getSeasonByYear(2004);
  console.log(
    `getSeasonByYear(2004) -> champion ${season2004?.worldChampionDriver?.fullName}, constructors ${season2004?.constructorsChampionTeam?.name}, ${season2004?.cars.length} cars`,
  );

  const season2026 = await seasonsQueries.getSeasonByYear(2026);
  console.log(
    `getSeasonByYear(2026) -> champion ${season2026?.worldChampionDriver?.fullName ?? "none yet (season in progress)"}`,
  );

  const years = await seasonsQueries.listSeasonYears();
  console.log("listSeasonYears ->", years.join(", "));

  const range = await seasonsQueries.getEarliestAndLatestSeason();
  console.log("getEarliestAndLatestSeason ->", range);

  // The search vectors are generated columns, so seeding should have populated them.
  // Milestone 9 builds the search UI on top of these; this proves the groundwork holds.
  const { db } = await import("../index");
  const { sql } = await import("drizzle-orm");

  const driverHits = await db.execute(
    sql`select full_name from drivers where search_vector @@ to_tsquery('simple', 'Schumacher')`,
  );
  const teamHits = await db.execute(
    sql`select name from teams where search_vector @@ to_tsquery('simple', 'Ferrari')`,
  );
  console.log(
    "\nFTS drivers @@ 'Schumacher' ->",
    driverHits.map((row) => row.full_name).join(", ") || "(no match)",
  );
  console.log(
    "FTS teams @@ 'Ferrari' ->",
    teamHits.map((row) => row.name).join(", ") || "(no match)",
  );

  console.log("\nAll data access layer queries returned without error.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Verification failed:", error);
  process.exit(1);
});
