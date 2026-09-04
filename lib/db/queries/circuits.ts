import { and, asc, eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { circuits, races, seasons } from "@/lib/db/schema";
import { circuitFiltersSchema } from "@/lib/validation/filters";

export type CircuitListItem = {
  slug: string;
  name: string;
  country: string;
  location: string | null;
  lengthKm: number | null;
  turns: number | null;
  firstGpYear: number | null;
  layoutImageUrl: string | null;
  dataConfidence: string;
};

export async function listCircuits(
  input: unknown = {},
): Promise<CircuitListItem[]> {
  const filters = circuitFiltersSchema.parse(input);

  const conditions = [];

  if (filters.country) conditions.push(eq(circuits.country, filters.country));
  if (filters.hostedInYear) {
    conditions.push(
      sql`exists ${db
        .select({ one: sql`1` })
        .from(races)
        .innerJoin(seasons, eq(races.seasonId, seasons.id))
        .where(
          and(
            eq(races.circuitId, circuits.id),
            eq(seasons.year, filters.hostedInYear),
          ),
        )}`,
    );
  }

  return db
    .select({
      slug: circuits.slug,
      name: circuits.name,
      country: circuits.country,
      location: circuits.location,
      lengthKm: circuits.lengthKm,
      turns: circuits.turns,
      firstGpYear: circuits.firstGpYear,
      layoutImageUrl: circuits.layoutImageUrl,
      dataConfidence: circuits.dataConfidence,
    })
    .from(circuits)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(circuits.name))
    .limit(filters.limit)
    .offset(filters.offset);
}

export async function getCircuitBySlug(slug: string) {
  return db.query.circuits.findFirst({
    where: eq(circuits.slug, slug),
    with: {
      lapRecordHolder: true,
      races: {
        with: { season: true, winnerDriver: true, winnerTeam: true },
      },
    },
  });
}

export async function listCircuitCountries(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ value: circuits.country })
    .from(circuits)
    .orderBy(asc(circuits.country));

  return rows.map((row) => row.value);
}

export async function listCircuitSlugs(): Promise<string[]> {
  const rows = await db.select({ slug: circuits.slug }).from(circuits);
  return rows.map((row) => row.slug);
}
