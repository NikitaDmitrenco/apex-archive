import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";

import * as cars from "@/lib/db/queries/cars";
import * as circuits from "@/lib/db/queries/circuits";
import * as drivers from "@/lib/db/queries/drivers";
import * as seasons from "@/lib/db/queries/seasons";
import { db } from "@/lib/db";
import {
  circuits as circuitsTable,
  drivers as driversTable,
  races,
  seasons as seasonsTable,
  teams as teamsTable,
} from "@/lib/db/schema";
import {
  compareTwoSeasonsSchema,
  findRacesAtCircuitSchema,
  getDriverSeasonRecordSchema,
  getSeasonSummarySchema,
  listCarsByChampionshipSchema,
  listChampionshipTeamsSchema,
  listCircuitsByCountrySchema,
  listDriversWithMinChampionshipsSchema,
  type ToolName,
} from "@/lib/ai/schemas";

/**
 * Bridge from OpenAI tool calls to the typed DAL. Each case parses its own arguments
 * with the matching Zod schema, runs the underlying query, and returns plain-data rows
 * the model can quote.
 *
 * Anything thrown by the underlying query becomes `{ error: <message> }` so the route can
 * surface a meaningful message to the client and the model can acknowledge the failure
 * without the whole request crashing.
 */
export async function executeTool(
  name: ToolName,
  rawArgs: unknown,
): Promise<unknown> {
  switch (name) {
    case "list_cars_by_championship":
      return runListCarsByChampionship(rawArgs);
    case "get_driver_season_record":
      return runGetDriverSeasonRecord(rawArgs);
    case "list_drivers_with_min_championships":
      return runListDriversWithMinChampionships(rawArgs);
    case "list_circuits_by_country":
      return runListCircuitsByCountry(rawArgs);
    case "find_races_at_circuit":
      return runFindRacesAtCircuit(rawArgs);
    case "get_season_summary":
      return runGetSeasonSummary(rawArgs);
    case "list_championship_teams":
      return runListChampionshipTeams(rawArgs);
    case "compare_two_seasons":
      return runCompareTwoSeasons(rawArgs);
  }
}

async function runListCarsByChampionship(rawArgs: unknown): Promise<unknown> {
  try {
    const args = listCarsByChampionshipSchema.parse(rawArgs);
    const items = await cars.listCars({
      championshipWinning: true,
      yearFrom: args.yearFrom,
      yearTo: args.yearTo,
      teamSlug: args.teamSlug,
      limit: 50,
    });
    return items.map((c) => ({
      slug: c.slug,
      name: c.name,
      year: c.year,
      teamName: c.teamName,
      teamSlug: c.teamSlug,
    }));
  } catch (err) {
    return { error: zodMessage(err) };
  }
}

async function runGetDriverSeasonRecord(rawArgs: unknown): Promise<unknown> {
  try {
    const args = getDriverSeasonRecordSchema.parse(rawArgs);
    const driver = await drivers.getDriverBySlug(args.driverSlug);
    if (!driver) return { error: "Driver not found" };
    const record = driver.driverStandings.find(
      (s) => s.season.year === args.year,
    );
    if (!record) {
      return { error: "Driver did not race this season in the archive" };
    }
    return {
      driverName: driver.fullName,
      year: args.year,
      teamName: record.team.name,
      teamSlug: record.team.slug,
      position: record.position,
      points: record.points,
      wins: record.wins,
    };
  } catch (err) {
    return { error: zodMessage(err) };
  }
}

async function runListDriversWithMinChampionships(
  rawArgs: unknown,
): Promise<unknown> {
  try {
    const args = listDriversWithMinChampionshipsSchema.parse(rawArgs);
    return db
      .select({
        slug: driversTable.slug,
        fullName: driversTable.fullName,
        championships: driversTable.championships,
      })
      .from(driversTable)
      .where(gte(driversTable.championships, args.minChampionships))
      .orderBy(desc(driversTable.championships), asc(driversTable.fullName))
      .limit(args.limit);
  } catch (err) {
    return { error: zodMessage(err) };
  }
}

async function runListCircuitsByCountry(rawArgs: unknown): Promise<unknown> {
  try {
    const args = listCircuitsByCountrySchema.parse(rawArgs);
    return circuits.listCircuits({ country: args.country, limit: 50 });
  } catch (err) {
    return { error: zodMessage(err) };
  }
}

async function runFindRacesAtCircuit(rawArgs: unknown): Promise<unknown> {
  try {
    const args = findRacesAtCircuitSchema.parse(rawArgs);
    return db
      .select({
        year: seasonsTable.year,
        roundNumber: races.roundNumber,
        name: races.name,
        date: races.date,
        winnerName: driversTable.fullName,
        winnerSlug: driversTable.slug,
        winnerTeamName: teamsTable.name,
        winnerTeamSlug: teamsTable.slug,
      })
      .from(races)
      .innerJoin(seasonsTable, eq(races.seasonId, seasonsTable.id))
      .innerJoin(circuitsTable, eq(races.circuitId, circuitsTable.id))
      .leftJoin(driversTable, eq(races.winnerDriverId, driversTable.id))
      .leftJoin(teamsTable, eq(races.winnerTeamId, teamsTable.id))
      .where(eq(circuitsTable.slug, args.circuitSlug))
      .orderBy(asc(seasonsTable.year), asc(races.roundNumber))
      .limit(args.limit);
  } catch (err) {
    return { error: zodMessage(err) };
  }
}

async function runGetSeasonSummary(rawArgs: unknown): Promise<unknown> {
  try {
    const args = getSeasonSummarySchema.parse(rawArgs);
    const season = await seasons.getSeasonByYear(args.year);
    if (!season) return { error: "Season not in the archive" };
    return seasonSummary(season);
  } catch (err) {
    return { error: zodMessage(err) };
  }
}

async function runListChampionshipTeams(rawArgs: unknown): Promise<unknown> {
  try {
    const args = listChampionshipTeamsSchema.parse(rawArgs);
    const conditions = [];
    if (args.yearFrom) conditions.push(gte(seasonsTable.year, args.yearFrom));
    if (args.yearTo) conditions.push(lte(seasonsTable.year, args.yearTo));

    return db
      .select({
        year: seasonsTable.year,
        name: teamsTable.name,
        slug: teamsTable.slug,
      })
      .from(seasonsTable)
      .innerJoin(
        teamsTable,
        eq(seasonsTable.constructorsChampionTeamId, teamsTable.id),
      )
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(seasonsTable.year));
  } catch (err) {
    return { error: zodMessage(err) };
  }
}

async function runCompareTwoSeasons(rawArgs: unknown): Promise<unknown> {
  try {
    const args = compareTwoSeasonsSchema.parse(rawArgs);
    const [a, b] = await Promise.all([
      seasons.getSeasonByYear(args.yearA),
      seasons.getSeasonByYear(args.yearB),
    ]);
    if (!a && !b) return { error: "Neither season is in the archive" };
    return {
      yearA: a ? seasonSummary(a) : null,
      yearB: b ? seasonSummary(b) : null,
    };
  } catch (err) {
    return { error: zodMessage(err) };
  }
}

function seasonSummary(
  season: NonNullable<Awaited<ReturnType<typeof seasons.getSeasonByYear>>>,
) {
  return {
    year: season.year,
    worldChampion: season.worldChampionDriver
      ? {
          name: season.worldChampionDriver.fullName,
          slug: season.worldChampionDriver.slug,
        }
      : null,
    constructorsChampion: season.constructorsChampionTeam
      ? {
          name: season.constructorsChampionTeam.name,
          slug: season.constructorsChampionTeam.slug,
        }
      : null,
    summary: season.summary,
  };
}

function zodMessage(err: unknown): string {
  if (err instanceof z.ZodError) {
    return `Invalid arguments: ${err.message}`;
  }
  return err instanceof Error ? err.message : "Unknown error";
}
