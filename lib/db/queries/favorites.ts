import { and, asc, eq, inArray } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth/queries";
import { db } from "@/lib/db";
import {
  cars,
  circuits,
  drivers,
  favorites,
  seasons,
  teams,
  type FavoriteEntityType,
} from "@/lib/db/schema";

/**
 * Whether the current user has saved a specific entity. Returns false when no user is
 * signed in — the caller decides whether to surface that as a "sign in to save" prompt.
 */
export async function isFavorited(
  entityType: FavoriteEntityType,
  entityId: string,
): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const rows = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(
      and(
        eq(favorites.userId, user.id),
        eq(favorites.entityType, entityType),
        eq(favorites.entityId, entityId),
      ),
    )
    .limit(1);

  return rows.length > 0;
}

/**
 * Toggle a favorite on or off for the current user. Returns the resulting state so the
 * client component can sync its UI without re-querying. Throws when called without a
 * session — the caller must redirect the user to /login first.
 */
export async function toggleFavorite(
  entityType: FavoriteEntityType,
  entityId: string,
  currentlyFavorited: boolean,
): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not signed in");

  if (currentlyFavorited) {
    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, user.id),
          eq(favorites.entityType, entityType),
          eq(favorites.entityId, entityId),
        ),
      );
    return false;
  }

  await db
    .insert(favorites)
    .values({ userId: user.id, entityType, entityId })
    .onConflictDoNothing();
  return true;
}

/**
 * Lightweight projection of an entity as displayed on the account page. Each variant only
 * carries the fields the listing actually renders — `href` is the link back to the detail
 * page so the favourites list can use plain `<Link>`s without per-row slug lookups.
 */
export type FavoriteCarRow = { id: string; name: string; href: string };
export type FavoriteDriverRow = {
  id: string;
  fullName: string;
  href: string;
};
export type FavoriteTeamRow = { id: string; name: string; href: string };
export type FavoriteCircuitRow = {
  id: string;
  name: string;
  href: string;
};
export type FavoriteSeasonRow = { id: string; year: number; href: string };

export type FavoriteListing = {
  cars: FavoriteCarRow[];
  drivers: FavoriteDriverRow[];
  teams: FavoriteTeamRow[];
  circuits: FavoriteCircuitRow[];
  seasons: FavoriteSeasonRow[];
};

/**
 * Lists a user's favorites grouped by entity type. One query per type, each joining the
 * favorites table to the relevant entity table by `entity_id`. Cheaper than a single union
 * because each branch selects only the columns its row shape needs.
 */
export async function listFavorites(userId: string): Promise<FavoriteListing> {
  const allFavs = await db
    .select({ entityType: favorites.entityType, entityId: favorites.entityId })
    .from(favorites)
    .where(eq(favorites.userId, userId));

  const byType = {
    car: allFavs
      .filter((row) => row.entityType === "car")
      .map((row) => row.entityId),
    driver: allFavs
      .filter((row) => row.entityType === "driver")
      .map((row) => row.entityId),
    team: allFavs
      .filter((row) => row.entityType === "team")
      .map((row) => row.entityId),
    circuit: allFavs
      .filter((row) => row.entityType === "circuit")
      .map((row) => row.entityId),
    season: allFavs
      .filter((row) => row.entityType === "season")
      .map((row) => row.entityId),
  };

  const [carRows, driverRows, teamRows, circuitRows, seasonRows] =
    await Promise.all([
      byType.car.length
        ? db
            .select({ id: cars.id, name: cars.name, slug: cars.slug })
            .from(cars)
            .where(inArray(cars.id, byType.car))
        : Promise.resolve([] as { id: string; name: string; slug: string }[]),
      byType.driver.length
        ? db
            .select({
              id: drivers.id,
              fullName: drivers.fullName,
              slug: drivers.slug,
            })
            .from(drivers)
            .where(inArray(drivers.id, byType.driver))
        : Promise.resolve(
            [] as { id: string; fullName: string; slug: string }[],
          ),
      byType.team.length
        ? db
            .select({ id: teams.id, name: teams.name, slug: teams.slug })
            .from(teams)
            .where(inArray(teams.id, byType.team))
        : Promise.resolve([] as { id: string; name: string; slug: string }[]),
      byType.circuit.length
        ? db
            .select({
              id: circuits.id,
              name: circuits.name,
              slug: circuits.slug,
            })
            .from(circuits)
            .where(inArray(circuits.id, byType.circuit))
        : Promise.resolve([] as { id: string; name: string; slug: string }[]),
      byType.season.length
        ? db
            .select({ id: seasons.id, year: seasons.year })
            .from(seasons)
            .where(inArray(seasons.id, byType.season))
            .orderBy(asc(seasons.year))
        : Promise.resolve([] as { id: string; year: number }[]),
    ]);

  return {
    cars: carRows.map((row) => ({
      id: row.id,
      name: row.name,
      href: `/cars/${row.slug}`,
    })),
    drivers: driverRows.map((row) => ({
      id: row.id,
      fullName: row.fullName,
      href: `/drivers/${row.slug}`,
    })),
    teams: teamRows.map((row) => ({
      id: row.id,
      name: row.name,
      href: `/teams/${row.slug}`,
    })),
    circuits: circuitRows.map((row) => ({
      id: row.id,
      name: row.name,
      href: `/circuits/${row.slug}`,
    })),
    seasons: seasonRows
      .map((row) => ({
        id: row.id,
        year: row.year,
        href: `/seasons/${row.year}`,
      }))
      // Newest season first — matches the editorial direction the rest of the archive uses.
      .sort((a, b) => b.year - a.year),
  };
}
