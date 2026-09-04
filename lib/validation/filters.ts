import { z } from "zod";

const year = z.coerce.number().int().min(1950).max(2100);

const decade = z.coerce
  .number()
  .int()
  .min(1950)
  .max(2100)
  .refine((value) => value % 10 === 0, "Decade must be a multiple of ten");

/**
 * `z.coerce.boolean()` turns the string "false" into true, so query-string flags are read
 * explicitly instead.
 */
const flag = z.union([
  z.boolean(),
  z.enum(["true", "false"]).transform((value) => value === "true"),
]);

const pagination = {
  limit: z.coerce.number().int().min(1).max(200).default(60),
  offset: z.coerce.number().int().min(0).default(0),
};

/** Era is a named year range from lib/constants/eras.ts; listCars resolves it to bounds. */
export const carFiltersSchema = z.object({
  era: z.string().min(1).optional(),
  teamSlug: z.string().min(1).optional(),
  driverSlug: z.string().min(1).optional(),
  engineManufacturer: z.string().min(1).optional(),
  year: year.optional(),
  yearFrom: year.optional(),
  yearTo: year.optional(),
  decade: decade.optional(),
  /** Cars whose team took the constructors' title that season. */
  championshipWinning: flag.optional(),
  ...pagination,
});

export const driverFiltersSchema = z.object({
  nationality: z.string().min(1).optional(),
  teamSlug: z.string().min(1).optional(),
  activeInYear: year.optional(),
  /** Drivers with no recorded final season. */
  activeOnly: flag.optional(),
  championsOnly: flag.optional(),
  ...pagination,
});

export const teamFiltersSchema = z.object({
  nationality: z.string().min(1).optional(),
  activeOnly: flag.optional(),
  championsOnly: flag.optional(),
  ...pagination,
});

export const circuitFiltersSchema = z.object({
  country: z.string().min(1).optional(),
  hostedInYear: year.optional(),
  ...pagination,
});

export const seasonFiltersSchema = z.object({
  yearFrom: year.optional(),
  yearTo: year.optional(),
  decade: decade.optional(),
  ...pagination,
});

export type CarFilters = z.infer<typeof carFiltersSchema>;
export type DriverFilters = z.infer<typeof driverFiltersSchema>;
export type TeamFilters = z.infer<typeof teamFiltersSchema>;
export type CircuitFilters = z.infer<typeof circuitFiltersSchema>;
export type SeasonFilters = z.infer<typeof seasonFiltersSchema>;
