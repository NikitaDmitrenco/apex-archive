import type { ChatCompletionTool } from "openai/resources/chat/completions";
import { toJSONSchema } from "zod";

import {
  compareTwoSeasonsSchema,
  findRacesAtCircuitSchema,
  getDriverSeasonRecordSchema,
  getSeasonSummarySchema,
  listCarsByChampionshipSchema,
  listChampionshipTeamsSchema,
  listCircuitsByCountrySchema,
  listDriversWithMinChampionshipsSchema,
} from "@/lib/ai/schemas";

/**
 * OpenAI function-calling tool specs for the AI Archive Assistant. One entry per supported
 * question shape — the model picks the right one(s) for the user's natural-language query
 * and we hand the structured arguments to the existing DAL functions in `execute.ts`.
 *
 * The OpenAI SDK accepts plain JSON Schema objects for `parameters`. We convert the Zod
 * schemas in `schemas.ts` via `toJSONSchema` so the runtime validation and the API shape
 * share a single source of truth.
 */
export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "list_cars_by_championship",
      description:
        "List cars whose constructor won the constructors' championship in a given year range, optionally filtered by team slug.",
      parameters: toJSONSchema(listCarsByChampionshipSchema) as Record<
        string,
        unknown
      >,
    },
  },
  {
    type: "function",
    function: {
      name: "get_driver_season_record",
      description:
        "Get a specific driver's championship position, points, and team in a specific season.",
      parameters: toJSONSchema(getDriverSeasonRecordSchema) as Record<
        string,
        unknown
      >,
    },
  },
  {
    type: "function",
    function: {
      name: "list_drivers_with_min_championships",
      description: "List drivers with at least N world championships.",
      parameters: toJSONSchema(listDriversWithMinChampionshipsSchema) as Record<
        string,
        unknown
      >,
    },
  },
  {
    type: "function",
    function: {
      name: "list_circuits_by_country",
      description: "List circuits in a given country.",
      parameters: toJSONSchema(listCircuitsByCountrySchema) as Record<
        string,
        unknown
      >,
    },
  },
  {
    type: "function",
    function: {
      name: "find_races_at_circuit",
      description:
        "List races held at a specific circuit in the archive, ordered by year.",
      parameters: toJSONSchema(findRacesAtCircuitSchema) as Record<
        string,
        unknown
      >,
    },
  },
  {
    type: "function",
    function: {
      name: "get_season_summary",
      description:
        "Get the world champion, constructors champion, and summary for a season.",
      parameters: toJSONSchema(getSeasonSummarySchema) as Record<
        string,
        unknown
      >,
    },
  },
  {
    type: "function",
    function: {
      name: "list_championship_teams",
      description:
        "List teams that won the constructors' championship in a given year range.",
      parameters: toJSONSchema(listChampionshipTeamsSchema) as Record<
        string,
        unknown
      >,
    },
  },
  {
    type: "function",
    function: {
      name: "compare_two_seasons",
      description:
        "Compare the world champions, constructors champions, and summaries of two seasons.",
      parameters: toJSONSchema(compareTwoSeasonsSchema) as Record<
        string,
        unknown
      >,
    },
  },
];
