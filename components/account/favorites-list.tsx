import Link from "next/link";

import { Eyebrow } from "@/components/ui/typography";
import type { FavoriteListing } from "@/lib/db/queries/favorites";

/** One row in the favourites listing: where to go and what text to render. */
type FavoriteItem = { id: string; href: string; label: string };

/**
 * Renders a user's favorites grouped by entity type. Empty groups are skipped entirely so
 * the page reads as "what they have saved", not as "here are five empty lists".
 */
export function FavoritesList({ favorites }: { favorites: FavoriteListing }) {
  const sections: { label: string; items: FavoriteItem[] }[] = [
    { label: "Cars", items: favorites.cars.map(carAsItem) },
    { label: "Drivers", items: favorites.drivers.map(driverAsItem) },
    { label: "Teams", items: favorites.teams.map(teamAsItem) },
    { label: "Circuits", items: favorites.circuits.map(circuitAsItem) },
    { label: "Seasons", items: favorites.seasons.map(seasonAsItem) },
  ];

  const visible = sections.filter((section) => section.items.length > 0);

  if (visible.length === 0) {
    return (
      <p className="text-muted-foreground border-border mt-12 border-t pt-6 leading-relaxed">
        Nothing saved yet. Open any car, driver, team, circuit or season and tap{" "}
        <span className="font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          ☆ Save
        </span>{" "}
        to keep it here for next time.
      </p>
    );
  }

  return (
    <div className="mt-12 space-y-12">
      {visible.map((section) => (
        <FavoritesSection
          key={section.label}
          label={section.label}
          items={section.items}
        />
      ))}
    </div>
  );
}

function FavoritesSection({
  label,
  items,
}: {
  label: string;
  items: FavoriteItem[];
}) {
  return (
    <section>
      <Eyebrow>{label}</Eyebrow>
      <ul className="mt-6">
        {items.map((item) => (
          <li key={item.id} className="border-border border-b">
            <Link
              href={item.href}
              className="group hover:bg-accent -mx-4 flex items-baseline justify-between gap-x-6 px-4 py-4 transition-colors"
            >
              <span className="font-display group-hover:text-primary text-xl font-light transition-colors">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function carAsItem(row: FavoriteListing["cars"][number]): FavoriteItem {
  return { id: row.id, href: row.href, label: row.name };
}

function driverAsItem(row: FavoriteListing["drivers"][number]): FavoriteItem {
  return { id: row.id, href: row.href, label: row.fullName };
}

function teamAsItem(row: FavoriteListing["teams"][number]): FavoriteItem {
  return { id: row.id, href: row.href, label: row.name };
}

function circuitAsItem(row: FavoriteListing["circuits"][number]): FavoriteItem {
  return { id: row.id, href: row.href, label: row.name };
}

function seasonAsItem(row: FavoriteListing["seasons"][number]): FavoriteItem {
  return { id: row.id, href: row.href, label: String(row.year) };
}
