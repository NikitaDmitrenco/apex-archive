import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { serverEnv } from "@/lib/env";

import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  apexArchiveClient?: ReturnType<typeof postgres>;
};

/**
 * `prepare: false` is required when DATABASE_URL points at Supabase's transaction pooler,
 * which cannot carry prepared statements across pooled connections.
 */
const client =
  globalForDb.apexArchiveClient ??
  postgres(serverEnv().DATABASE_URL, { prepare: false });

// Without this the dev server opens a new pool on every hot reload.
if (process.env.NODE_ENV !== "production") {
  globalForDb.apexArchiveClient = client;
}

export const db = drizzle(client, { schema });
