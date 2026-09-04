import { relations, sql } from "drizzle-orm";
import {
  customType,
  date,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Postgres full-text search vector. Drizzle has no built-in tsvector type, so the column
 * type is declared here and populated by generated expressions on each table.
 */
const tsvector = customType<{ data: string; driverData: string }>({
  dataType() {
    return "tsvector";
  },
});

/**
 * How much the archive trusts a row. Nothing is silently plausible: a value that could not
 * be confirmed is marked, never guessed. See MASTERPROMPT section 6.
 */
export const dataConfidence = pgEnum("data_confidence", [
  "verified",
  "placeholder",
  "uncertain",
]);

export const resultStatus = pgEnum("result_status", [
  "finished",
  "dnf",
  "dsq",
  "dns",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const drivers = pgTable(
  "drivers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    fullName: text("full_name").notNull(),
    nationality: text("nationality").notNull(),
    dateOfBirth: date("date_of_birth"),
    dateOfDeath: date("date_of_death"),
    careerStartYear: integer("career_start_year"),
    /** Null means the driver is still racing. */
    careerEndYear: integer("career_end_year"),
    photoUrl: text("photo_url"),
    bio: text("bio"),
    /**
     * Published career totals, stored rather than derived. The archive seeds only a subset
     * of races, so aggregating `results` would understate a career and present the shortfall
     * as fact. Null means unknown — never render it as zero.
     */
    championships: integer("championships"),
    wins: integer("wins"),
    poles: integer("poles"),
    podiums: integer("podiums"),
    raceStarts: integer("race_starts"),
    careerPoints: numeric("career_points", {
      precision: 8,
      scale: 2,
      mode: "number",
    }),
    dataConfidence: dataConfidence("data_confidence")
      .notNull()
      .default("placeholder"),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`setweight(to_tsvector('simple', coalesce(full_name, '')), 'A') || setweight(to_tsvector('simple', coalesce(nationality, '')), 'C')`,
    ),
    ...timestamps,
  },
  (table) => [index("drivers_search_idx").using("gin", table.searchVector)],
);

export const teams = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    nationality: text("nationality").notNull(),
    foundedYear: integer("founded_year"),
    /** Null means the team is still competing. */
    dissolvedYear: integer("dissolved_year"),
    logoUrl: text("logo_url"),
    baseLocation: text("base_location"),
    bio: text("bio"),
    /** Published totals, stored for the same reason as the driver ones. Null means unknown. */
    championships: integer("championships"),
    wins: integer("wins"),
    poles: integer("poles"),
    dataConfidence: dataConfidence("data_confidence")
      .notNull()
      .default("placeholder"),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`setweight(to_tsvector('simple', coalesce(name, '')), 'A') || setweight(to_tsvector('simple', coalesce(nationality, '')), 'C')`,
    ),
    ...timestamps,
  },
  (table) => [index("teams_search_idx").using("gin", table.searchVector)],
);

export const seasons = pgTable(
  "seasons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    year: integer("year").notNull().unique(),
    worldChampionDriverId: uuid("world_champion_driver_id").references(
      () => drivers.id,
    ),
    constructorsChampionTeamId: uuid(
      "constructors_champion_team_id",
    ).references(() => teams.id),
    summary: text("summary"),
    dataConfidence: dataConfidence("data_confidence")
      .notNull()
      .default("placeholder"),
    /**
     * Year is deliberately excluded: an int-to-text cast is not reliably immutable enough
     * for a stored generated column, and a year wants an exact match anyway. Search matches
     * `year` directly when the query parses as a number.
     */
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`to_tsvector('english', coalesce(summary, ''))`,
    ),
    ...timestamps,
  },
  (table) => [index("seasons_search_idx").using("gin", table.searchVector)],
);

export const circuits = pgTable(
  "circuits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    country: text("country").notNull(),
    location: text("location"),
    lengthKm: numeric("length_km", { precision: 6, scale: 3, mode: "number" }),
    turns: integer("turns"),
    lapsStandard: integer("laps_standard"),
    /** Stored as written on the timing sheet, e.g. "1:21.046". */
    lapRecordTime: text("lap_record_time"),
    lapRecordHolderDriverId: uuid("lap_record_holder_driver_id").references(
      () => drivers.id,
    ),
    lapRecordYear: integer("lap_record_year"),
    firstGpYear: integer("first_gp_year"),
    layoutImageUrl: text("layout_image_url"),
    dataConfidence: dataConfidence("data_confidence")
      .notNull()
      .default("placeholder"),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`setweight(to_tsvector('simple', coalesce(name, '')), 'A') || setweight(to_tsvector('simple', coalesce(country, '')), 'B') || setweight(to_tsvector('simple', coalesce(location, '')), 'C')`,
    ),
    ...timestamps,
  },
  (table) => [index("circuits_search_idx").using("gin", table.searchVector)],
);

/** Free-form technical description of a car, rendered as the technical breakdown block. */
export type TechnicalBreakdown = {
  frontWing?: string;
  suspension?: string;
  engine?: string;
  rearWing?: string;
  tyres?: string;
  chassis?: string;
};

export const cars = pgTable(
  "cars",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id),
    chassisName: text("chassis_name"),
    engineManufacturer: text("engine_manufacturer"),
    /** Cylinder layout as commonly written, e.g. "V10", "V6 turbo hybrid". */
    engineConfig: text("engine_config"),
    capacityLiters: numeric("capacity_liters", {
      precision: 3,
      scale: 1,
      mode: "number",
    }),
    /** Manufacturers rarely publish exact figures; treat as approximate. */
    powerHp: integer("power_hp"),
    weightKg: integer("weight_kg"),
    imageUrl: text("image_url"),
    technicalBreakdown: jsonb(
      "technical_breakdown",
    ).$type<TechnicalBreakdown>(),
    dataConfidence: dataConfidence("data_confidence")
      .notNull()
      .default("placeholder"),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      sql`setweight(to_tsvector('simple', coalesce(name, '')), 'A') || setweight(to_tsvector('simple', coalesce(chassis_name, '')), 'B') || setweight(to_tsvector('simple', coalesce(engine_manufacturer, '')), 'C')`,
    ),
    ...timestamps,
  },
  (table) => [index("cars_search_idx").using("gin", table.searchVector)],
);

export const races = pgTable(
  "races",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id),
    circuitId: uuid("circuit_id")
      .notNull()
      .references(() => circuits.id),
    roundNumber: integer("round_number").notNull(),
    name: text("name").notNull(),
    date: date("date"),
    laps: integer("laps"),
    distanceKm: numeric("distance_km", {
      precision: 7,
      scale: 3,
      mode: "number",
    }),
    polePositionDriverId: uuid("pole_position_driver_id").references(
      () => drivers.id,
    ),
    fastestLapDriverId: uuid("fastest_lap_driver_id").references(
      () => drivers.id,
    ),
    winnerDriverId: uuid("winner_driver_id").references(() => drivers.id),
    winnerTeamId: uuid("winner_team_id").references(() => teams.id),
    dataConfidence: dataConfidence("data_confidence")
      .notNull()
      .default("placeholder"),
    ...timestamps,
  },
  (table) => [
    unique("races_season_round_unique").on(table.seasonId, table.roundNumber),
  ],
);

export const results = pgTable(
  "results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    raceId: uuid("race_id")
      .notNull()
      .references(() => races.id, { onDelete: "cascade" }),
    driverId: uuid("driver_id")
      .notNull()
      .references(() => drivers.id),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id),
    carId: uuid("car_id").references(() => cars.id),
    gridPosition: integer("grid_position"),
    /** Null when the driver did not see the flag; `status` says why. */
    finishPosition: integer("finish_position"),
    status: resultStatus("status").notNull().default("finished"),
    points: numeric("points", { precision: 6, scale: 2, mode: "number" })
      .notNull()
      .default(0),
    dataConfidence: dataConfidence("data_confidence")
      .notNull()
      .default("placeholder"),
  },
  (table) => [
    unique("results_race_driver_unique").on(table.raceId, table.driverId),
  ],
);

/**
 * Final driver classification for a season. Split from constructor standings rather than
 * held in one polymorphic `championships` table, which would need an entity_id pointing at
 * either a driver or a team.
 */
export const driverStandings = pgTable(
  "driver_standings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id, { onDelete: "cascade" }),
    driverId: uuid("driver_id")
      .notNull()
      .references(() => drivers.id),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id),
    position: integer("position").notNull(),
    points: numeric("points", { precision: 7, scale: 2, mode: "number" })
      .notNull()
      .default(0),
    wins: integer("wins").notNull().default(0),
    podiums: integer("podiums").notNull().default(0),
    dataConfidence: dataConfidence("data_confidence")
      .notNull()
      .default("placeholder"),
  },
  (table) => [
    unique("driver_standings_season_driver_unique").on(
      table.seasonId,
      table.driverId,
    ),
  ],
);

export const constructorStandings = pgTable(
  "constructor_standings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id, { onDelete: "cascade" }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id),
    position: integer("position").notNull(),
    points: numeric("points", { precision: 7, scale: 2, mode: "number" })
      .notNull()
      .default(0),
    wins: integer("wins").notNull().default(0),
    dataConfidence: dataConfidence("data_confidence")
      .notNull()
      .default("placeholder"),
  },
  (table) => [
    unique("constructor_standings_season_team_unique").on(
      table.seasonId,
      table.teamId,
    ),
  ],
);

/** Which driver raced for which team in which season, and in what. */
export const driverTeamSeasons = pgTable(
  "driver_team_seasons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    driverId: uuid("driver_id")
      .notNull()
      .references(() => drivers.id, { onDelete: "cascade" }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teams.id),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id),
    carId: uuid("car_id").references(() => cars.id),
  },
  (table) => [
    index("driver_team_seasons_driver_season_idx").on(
      table.driverId,
      table.seasonId,
    ),
    unique("driver_team_seasons_unique").on(
      table.driverId,
      table.teamId,
      table.seasonId,
    ),
  ],
);

/** Editorial long-form content. Schema now, UI in Milestone 14 (Stories). */
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  body: text("body").notNull(),
  coverImageUrl: text("cover_image_url"),
  tags: text("tags").array(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps,
});

export const driversRelations = relations(drivers, ({ many }) => ({
  results: many(results),
  driverStandings: many(driverStandings),
  driverTeamSeasons: many(driverTeamSeasons),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  cars: many(cars),
  results: many(results),
  constructorStandings: many(constructorStandings),
  driverTeamSeasons: many(driverTeamSeasons),
}));

export const seasonsRelations = relations(seasons, ({ one, many }) => ({
  worldChampionDriver: one(drivers, {
    fields: [seasons.worldChampionDriverId],
    references: [drivers.id],
  }),
  constructorsChampionTeam: one(teams, {
    fields: [seasons.constructorsChampionTeamId],
    references: [teams.id],
  }),
  cars: many(cars),
  races: many(races),
  driverStandings: many(driverStandings),
  constructorStandings: many(constructorStandings),
}));

export const circuitsRelations = relations(circuits, ({ one, many }) => ({
  lapRecordHolder: one(drivers, {
    fields: [circuits.lapRecordHolderDriverId],
    references: [drivers.id],
  }),
  races: many(races),
}));

export const carsRelations = relations(cars, ({ one, many }) => ({
  team: one(teams, { fields: [cars.teamId], references: [teams.id] }),
  season: one(seasons, { fields: [cars.seasonId], references: [seasons.id] }),
  results: many(results),
  driverTeamSeasons: many(driverTeamSeasons),
}));

export const racesRelations = relations(races, ({ one, many }) => ({
  season: one(seasons, { fields: [races.seasonId], references: [seasons.id] }),
  circuit: one(circuits, {
    fields: [races.circuitId],
    references: [circuits.id],
  }),
  winnerDriver: one(drivers, {
    fields: [races.winnerDriverId],
    references: [drivers.id],
  }),
  winnerTeam: one(teams, {
    fields: [races.winnerTeamId],
    references: [teams.id],
  }),
  results: many(results),
}));

export const resultsRelations = relations(results, ({ one }) => ({
  race: one(races, { fields: [results.raceId], references: [races.id] }),
  driver: one(drivers, {
    fields: [results.driverId],
    references: [drivers.id],
  }),
  team: one(teams, { fields: [results.teamId], references: [teams.id] }),
  car: one(cars, { fields: [results.carId], references: [cars.id] }),
}));

export const driverStandingsRelations = relations(
  driverStandings,
  ({ one }) => ({
    season: one(seasons, {
      fields: [driverStandings.seasonId],
      references: [seasons.id],
    }),
    driver: one(drivers, {
      fields: [driverStandings.driverId],
      references: [drivers.id],
    }),
    team: one(teams, {
      fields: [driverStandings.teamId],
      references: [teams.id],
    }),
  }),
);

export const constructorStandingsRelations = relations(
  constructorStandings,
  ({ one }) => ({
    season: one(seasons, {
      fields: [constructorStandings.seasonId],
      references: [seasons.id],
    }),
    team: one(teams, {
      fields: [constructorStandings.teamId],
      references: [teams.id],
    }),
  }),
);

export const driverTeamSeasonsRelations = relations(
  driverTeamSeasons,
  ({ one }) => ({
    driver: one(drivers, {
      fields: [driverTeamSeasons.driverId],
      references: [drivers.id],
    }),
    team: one(teams, {
      fields: [driverTeamSeasons.teamId],
      references: [teams.id],
    }),
    season: one(seasons, {
      fields: [driverTeamSeasons.seasonId],
      references: [seasons.id],
    }),
    car: one(cars, {
      fields: [driverTeamSeasons.carId],
      references: [cars.id],
    }),
  }),
);

export type Driver = typeof drivers.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type Season = typeof seasons.$inferSelect;
export type Circuit = typeof circuits.$inferSelect;
export type Car = typeof cars.$inferSelect;
export type Race = typeof races.$inferSelect;
export type Result = typeof results.$inferSelect;
export type DriverStanding = typeof driverStandings.$inferSelect;
export type ConstructorStanding = typeof constructorStandings.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type DataConfidence = (typeof dataConfidence.enumValues)[number];
