import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { seasons, teams } from "@/lib/db/schema";
import { teamFiltersSchema } from "@/lib/validation/filters";

export type TeamListItem = {
  slug: string;
  name: string;
  nationality: string;
  foundedYear: number | null;
  dissolvedYear: number | null;
  championships: number | null;
  wins: number | null;
  logoUrl: string | null;
  dataConfidence: string;
};

export async function listTeams(input: unknown = {}): Promise<TeamListItem[]> {
  const filters = teamFiltersSchema.parse(input);

  const conditions = [];

  if (filters.nationality) {
    conditions.push(eq(teams.nationality, filters.nationality));
  }
  if (filters.activeOnly) conditions.push(isNull(teams.dissolvedYear));
  if (filters.championsOnly) conditions.push(sql`${teams.championships} > 0`);

  return db
    .select({
      slug: teams.slug,
      name: teams.name,
      nationality: teams.nationality,
      foundedYear: teams.foundedYear,
      dissolvedYear: teams.dissolvedYear,
      championships: teams.championships,
      wins: teams.wins,
      logoUrl: teams.logoUrl,
      dataConfidence: teams.dataConfidence,
    })
    .from(teams)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(teams.championships), asc(teams.name))
    .limit(filters.limit)
    .offset(filters.offset);
}

export async function getTeamBySlug(slug: string) {
  return db.query.teams.findFirst({
    where: eq(teams.slug, slug),
    with: {
      cars: { with: { season: true } },
      driverTeamSeasons: { with: { driver: true, season: true } },
      constructorStandings: { with: { season: true } },
    },
  });
}

export async function listTeamSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: teams.slug }).from(teams);
  return rows.map((row) => row.slug);
}

export async function listTeamNationalities(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ value: teams.nationality })
    .from(teams)
    .orderBy(asc(teams.nationality));

  return rows.map((row) => row.value);
}

export async function getTeamChampionshipSeasons(teamId: string) {
  return db
    .select({ year: seasons.year })
    .from(seasons)
    .where(eq(seasons.constructorsChampionTeamId, teamId))
    .orderBy(asc(seasons.year));
}
