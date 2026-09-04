import type { Metadata } from "next";

import { ArchiveStats } from "@/components/archive/home/archive-stats";
import { EditorialStatement } from "@/components/archive/home/editorial-statement";
import { FeaturedCars } from "@/components/archive/home/featured-cars";
import { Hero } from "@/components/archive/home/hero";
import { LegendaryDrivers } from "@/components/archive/home/legendary-drivers";
import { Moments } from "@/components/archive/home/moments";
import { NowSeason } from "@/components/archive/home/now-season";
import { Circuits, Teams } from "@/components/archive/home/teams-and-circuits";
import { getArchiveStats } from "@/lib/db/queries/archive";
import { listCars } from "@/lib/db/queries/cars";
import { listCircuits } from "@/lib/db/queries/circuits";
import { listDrivers } from "@/lib/db/queries/drivers";
import {
  getSeasonStandings,
  listSeasons,
  type SeasonListItem,
} from "@/lib/db/queries/seasons";
import { listTeams } from "@/lib/db/queries/teams";

export const metadata: Metadata = {
  description:
    "The home of Apex Archive — the machines, the drivers, the circuits and the stories of Formula 1, 1950 through to the current season.",
};

/** Prerendered, but refreshed hourly so the current-season block cannot freeze at build time. */
export const revalidate = 3600;

export default async function HomePage() {
  const [stats, cars, drivers, teams, circuits, seasons] = await Promise.all([
    getArchiveStats(),
    listCars({ championshipWinning: true, limit: 6 }),
    listDrivers({ championsOnly: true, limit: 6 }),
    listTeams({ championsOnly: true, limit: 6 }),
    listCircuits({ limit: 6 }),
    listSeasons({ limit: 40 }),
  ]);

  // The newest season in the archive is the one presented as "now".
  const currentSeason: SeasonListItem | undefined = seasons[0];
  const standings = currentSeason
    ? await getSeasonStandings(currentSeason.year)
    : { drivers: [], constructors: [] };

  return (
    <>
      <Hero earliestYear={stats.earliestYear} latestYear={stats.latestYear} />
      <EditorialStatement />

      {currentSeason ? (
        <NowSeason
          year={currentSeason.year}
          summary={currentSeason.summary}
          drivers={standings.drivers}
          constructors={standings.constructors}
        />
      ) : null}

      <FeaturedCars cars={cars} />
      <LegendaryDrivers drivers={drivers} />
      <Moments seasons={seasons} excludeYear={currentSeason?.year} />
      <Teams teams={teams} />
      <Circuits circuits={circuits} />
      <ArchiveStats stats={stats} />
    </>
  );
}
