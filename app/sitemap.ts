import type { MetadataRoute } from "next";
import { listArticleSlugs } from "@/lib/db/queries/articles";
import { listCarSlugs } from "@/lib/db/queries/cars";
import { listCircuitSlugs } from "@/lib/db/queries/circuits";
import { listDriverSlugs } from "@/lib/db/queries/drivers";
import { listSeasonYears } from "@/lib/db/queries/seasons";
import { listTeamSlugs } from "@/lib/db/queries/teams";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cars, drivers, teams, circuits, seasons, stories] = await Promise.all([
    listCarSlugs(),
    listDriverSlugs(),
    listTeamSlugs(),
    listCircuitSlugs(),
    listSeasonYears(),
    listArticleSlugs(),
  ]);

  const staticRoutes = [
    "",
    "/cars",
    "/drivers",
    "/teams",
    "/circuits",
    "/seasons",
    "/search",
    "/about",
    "/compare",
    "/eras",
    "/stories",
    "/assistant",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.6,
  }));

  const carRoutes = cars.map((slug) => ({
    url: `${SITE_URL}/cars/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const driverRoutes = drivers.map((slug) => ({
    url: `${SITE_URL}/drivers/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const teamRoutes = teams.map((slug) => ({
    url: `${SITE_URL}/teams/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const circuitRoutes = circuits.map((slug) => ({
    url: `${SITE_URL}/circuits/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const seasonRoutes = seasons.map((year) => ({
    url: `${SITE_URL}/seasons/${year}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const storyRoutes = stories.map((slug) => ({
    url: `${SITE_URL}/stories/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...carRoutes,
    ...driverRoutes,
    ...teamRoutes,
    ...circuitRoutes,
    ...seasonRoutes,
    ...storyRoutes,
  ];
}
