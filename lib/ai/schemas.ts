import { z } from "zod";

const year = z.number().int().min(1950).max(2100);

export const listCarsByChampionshipSchema = z.object({
  yearFrom: year.optional().describe("Start year, inclusive"),
  yearTo: year.optional().describe("End year, inclusive"),
  teamSlug: z
    .string()
    .min(1)
    .optional()
    .describe("Filter by team slug, e.g. 'ferrari'"),
});

export const getDriverSeasonRecordSchema = z.object({
  driverSlug: z
    .string()
    .min(1)
    .describe("Driver slug, e.g. 'michael-schumacher'"),
  year,
});

export const listDriversWithMinChampionshipsSchema = z.object({
  minChampionships: z
    .number()
    .int()
    .min(1)
    .describe("Minimum championship count"),
  limit: z.number().int().min(1).max(100).optional().default(20),
});

export const listCircuitsByCountrySchema = z.object({
  country: z.string().min(1).describe("Country name, e.g. 'Italy'"),
});

export const findRacesAtCircuitSchema = z.object({
  circuitSlug: z.string().min(1).describe("Circuit slug, e.g. 'monza'"),
  limit: z.number().int().min(1).max(100).optional().default(50),
});

export const getSeasonSummarySchema = z.object({
  year,
});

export const listChampionshipTeamsSchema = z.object({
  yearFrom: year.optional(),
  yearTo: year.optional(),
});

export const compareTwoSeasonsSchema = z.object({
  yearA: year,
  yearB: year,
});

export const toolSchemas = {
  list_cars_by_championship: listCarsByChampionshipSchema,
  get_driver_season_record: getDriverSeasonRecordSchema,
  list_drivers_with_min_championships: listDriversWithMinChampionshipsSchema,
  list_circuits_by_country: listCircuitsByCountrySchema,
  find_races_at_circuit: findRacesAtCircuitSchema,
  get_season_summary: getSeasonSummarySchema,
  list_championship_teams: listChampionshipTeamsSchema,
  compare_two_seasons: compareTwoSeasonsSchema,
} as const;

export type ToolName = keyof typeof toolSchemas;
