export type Era = {
  slug: string;
  label: string;
  from: number;
  /** Undefined means the era is still running. */
  to?: number;
};

/**
 * Eras are drawn from engine regulation changes, which are a matter of record, rather than
 * from editorial names for periods of the sport. The labels describe the formula so that no
 * characterisation is invented; the boundaries are the years the formula applied.
 */
export const ERAS: Era[] = [
  { slug: "front-engine", label: "Front-engine era", from: 1950, to: 1960 },
  { slug: "1-5-litre", label: "1.5-litre era", from: 1961, to: 1965 },
  {
    slug: "3-litre-turbo",
    label: "3-litre and turbo era",
    from: 1966,
    to: 1988,
  },
  { slug: "3-5-litre", label: "3.5-litre era", from: 1989, to: 1994 },
  { slug: "v10", label: "V10 era", from: 1995, to: 2005 },
  { slug: "v8", label: "V8 era", from: 2006, to: 2013 },
  { slug: "hybrid", label: "V6 turbo hybrid era", from: 2014, to: 2025 },
  { slug: "2026-regulations", label: "New regulations", from: 2026 },
];

export function findEra(slug: string): Era | undefined {
  return ERAS.find((era) => era.slug === slug);
}

export function formatEraRange(era: Era): string {
  return era.to ? `${era.from} — ${era.to}` : `${era.from} —`;
}
