import { asc, desc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { cars, circuits, drivers, seasons, teams } from "@/lib/db/schema";

/**
 * Hard cap on hits surfaced per entity type. Eight reads as one full page of results in
 * the editorial layout; raising it would push later rows off the fold without offering any
 * navigation affordance. The backend can return more if a future ranking change wants to
 * surface a longer tail.
 */
const MAX_RESULTS_PER_GROUP = 8;

export type SearchResults = {
  query: string;
  drivers: { slug: string; fullName: string; nationality: string }[];
  teams: { slug: string; name: string; nationality: string }[];
  seasons: { year: number; summary: string | null }[];
  circuits: { slug: string; name: string; country: string }[];
  cars: { slug: string; name: string; teamName: string; year: number }[];
};

/**
 * One query across the archive, grouped by entity type. Runs five parallel PostgreSQL FTS
 * matches (and one extra OR clause on `seasons.year` when the input parses as a year).
 *
 * `websearch_to_tsquery` is used instead of `to_tsquery` so user-supplied punctuation
 * ("Ferrari F2004", "andretti?", quoted phrases) never throws a syntax error — it is the
 * standard Postgres ≥11 input mode that mirrors a search-engine query box.
 *
 * The `simple` configuration is intentional: entity names and nationalities are not
 * English-language prose, and stemming would degrade "Verstappen" to garbage. Seasons
 * index `summary` with `english` in the schema; ranking still picks up the right hit.
 */
export async function globalSearch(rawQuery: string): Promise<SearchResults> {
  const query = rawQuery.trim();

  if (!query) {
    return {
      query: "",
      drivers: [],
      teams: [],
      seasons: [],
      circuits: [],
      cars: [],
    };
  }

  const tsq = sql`websearch_to_tsquery('simple', ${query})`;

  // Seasons deliberately do not index `year` in their tsvector (an int-to-text cast is not
  // reliably immutable for a stored generated column). Match the year directly when the
  // query parses as one — "show me 2026" must work even though "2026" never lands in
  // `summary`.
  const numericQuery = Number.parseInt(query, 10);
  const isYear =
    Number.isFinite(numericQuery) &&
    String(numericQuery) === query &&
    numericQuery >= 1950 &&
    numericQuery <= 2100;

  const seasonWhere = isYear
    ? sql`(${seasons.searchVector} @@ ${tsq} or ${seasons.year} = ${numericQuery})`
    : sql`${seasons.searchVector} @@ ${tsq}`;

  const [driverRows, teamRows, seasonRows, circuitRows, carRows] =
    await Promise.all([
      db
        .select({
          slug: drivers.slug,
          fullName: drivers.fullName,
          nationality: drivers.nationality,
        })
        .from(drivers)
        .where(sql`${drivers.searchVector} @@ ${tsq}`)
        .orderBy(
          sql`ts_rank(${drivers.searchVector}, ${tsq}) desc`,
          asc(drivers.fullName),
        )
        .limit(MAX_RESULTS_PER_GROUP),
      db
        .select({
          slug: teams.slug,
          name: teams.name,
          nationality: teams.nationality,
        })
        .from(teams)
        .where(sql`${teams.searchVector} @@ ${tsq}`)
        .orderBy(
          sql`ts_rank(${teams.searchVector}, ${tsq}) desc`,
          asc(teams.name),
        )
        .limit(MAX_RESULTS_PER_GROUP),
      db
        .select({
          year: seasons.year,
          summary: seasons.summary,
        })
        .from(seasons)
        .where(seasonWhere)
        .orderBy(
          sql`ts_rank(${seasons.searchVector}, ${tsq}) desc`,
          desc(seasons.year),
        )
        .limit(MAX_RESULTS_PER_GROUP),
      db
        .select({
          slug: circuits.slug,
          name: circuits.name,
          country: circuits.country,
        })
        .from(circuits)
        .where(sql`${circuits.searchVector} @@ ${tsq}`)
        .orderBy(
          sql`ts_rank(${circuits.searchVector}, ${tsq}) desc`,
          asc(circuits.name),
        )
        .limit(MAX_RESULTS_PER_GROUP),
      db
        .select({
          slug: cars.slug,
          name: cars.name,
          teamName: teams.name,
          year: seasons.year,
        })
        .from(cars)
        .innerJoin(teams, eq(cars.teamId, teams.id))
        .innerJoin(seasons, eq(cars.seasonId, seasons.id))
        .where(sql`${cars.searchVector} @@ ${tsq}`)
        .orderBy(
          sql`ts_rank(${cars.searchVector}, ${tsq}) desc`,
          desc(seasons.year),
        )
        .limit(MAX_RESULTS_PER_GROUP),
    ]);

  return {
    query,
    drivers: driverRows,
    teams: teamRows,
    seasons: seasonRows,
    circuits: circuitRows,
    cars: carRows,
  };
}
