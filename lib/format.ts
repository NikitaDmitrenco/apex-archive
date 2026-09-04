const EM_DASH = "—";

/**
 * Renders an unknown value as a dash. Statistics in this archive are frequently null
 * because they could not be verified, and a null must never surface as a zero.
 */
export function orDash(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return EM_DASH;
  return String(value);
}

export function formatPoints(points: number): string {
  return Number.isInteger(points) ? String(points) : points.toFixed(1);
}

/** "V10 · 3.0 L" — the technical caption style used across car listings. */
export function formatEngine(
  config: string | null,
  capacityLiters: number | null,
): string {
  const parts = [
    config,
    capacityLiters ? `${capacityLiters.toFixed(1)} L` : null,
  ];
  const present = parts.filter((part): part is string => Boolean(part));
  return present.length ? present.join(" · ") : EM_DASH;
}
