/**
 * Drops empty values from a query string before validation. Unset selects in the filter
 * forms submit as `field=`, which is absence rather than a value to filter on.
 */
export function withoutBlanks(
  params: Record<string, string | string[] | undefined>,
) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== "",
    ),
  );
}
