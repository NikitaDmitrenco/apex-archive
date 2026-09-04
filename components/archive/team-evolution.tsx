"use client";

import Link from "next/link";
import { useState } from "react";

import { Eyebrow } from "@/components/ui/typography";
import { formatPoints, orDash } from "@/lib/format";
import { cn } from "@/lib/utils";

export type TeamSeasonEntry = {
  year: number;
  cars: { slug: string; name: string }[];
  drivers: { slug: string; fullName: string }[];
  standing: { position: number; points: number; wins: number | null } | null;
  wonConstructors: boolean;
};

/**
 * The team evolution timeline from section 4.4: picking a year swaps the cars and drivers
 * shown. Every season is passed in already, so switching years costs no request.
 */
export function TeamEvolution({
  seasons,
  teamName,
}: {
  seasons: TeamSeasonEntry[];
  teamName: string;
}) {
  const [selectedYear, setSelectedYear] = useState(seasons[0]?.year);

  if (seasons.length === 0) return null;

  const selected =
    seasons.find((season) => season.year === selectedYear) ?? seasons[0];

  return (
    <div>
      <Eyebrow>Evolution</Eyebrow>

      <div
        role="tablist"
        aria-label={`Seasons of ${teamName} held in this archive`}
        className="border-border mt-6 flex flex-wrap gap-x-2 gap-y-2 border-b pb-6"
      >
        {seasons.map((season) => {
          const isSelected = season.year === selected.year;
          return (
            <button
              key={season.year}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedYear(season.year)}
              className={cn(
                "focus-visible:ring-ring border px-4 py-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none",
                isSelected
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {season.year}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-12 md:grid-cols-3">
        <div>
          <h3 className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.14em] uppercase">
            Season
          </h3>
          <p className="font-display mt-3 text-5xl leading-none font-light">
            <Link
              href={`/seasons/${selected.year}`}
              className="hover:text-primary transition-colors"
            >
              {selected.year}
            </Link>
          </p>
          {selected.wonConstructors ? (
            <p className="text-primary mt-4 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
              Constructors&apos; champion
            </p>
          ) : null}
          {selected.standing ? (
            <p className="text-muted-foreground mt-4 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
              Finished {selected.standing.position} ·{" "}
              {formatPoints(selected.standing.points)} pts ·{" "}
              {orDash(selected.standing.wins)} wins
            </p>
          ) : null}
        </div>

        <div>
          <h3 className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.14em] uppercase">
            Cars
          </h3>
          {selected.cars.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {selected.cars.map((car) => (
                <li key={car.slug}>
                  <Link
                    href={`/cars/${car.slug}`}
                    className="font-display hover:text-primary text-xl font-light transition-colors"
                  >
                    {car.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground/60 mt-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
              None recorded
            </p>
          )}
        </div>

        <div>
          <h3 className="text-muted-foreground font-mono text-[0.65rem] tracking-[0.14em] uppercase">
            Drivers
          </h3>
          {selected.drivers.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {selected.drivers.map((driver) => (
                <li key={driver.slug}>
                  <Link
                    href={`/drivers/${driver.slug}`}
                    className="font-display hover:text-primary text-xl font-light transition-colors"
                  >
                    {driver.fullName}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground/60 mt-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
              None recorded
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
