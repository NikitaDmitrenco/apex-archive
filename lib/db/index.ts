import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { serverEnv } from "@/lib/env";

import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  apexArchiveClient?: ReturnType<typeof postgres>;
};

/**
 * DATABASE_URL must point at Supabase's SESSION pooler (port 5432), not the transaction
 * pooler (6543).
 *
 * postgres.js pipelines concurrent queries down one connection. Transaction mode binds a
 * server connection per transaction and cannot interleave them, so a page issuing several
 * queries at once stalls: Postgres finishes the work and parks in ClientRead while the
 * driver waits for a reply that never comes, until statement_timeout kills it two minutes
 * later. Sequential scripts survive it, which is why the seed and verify scripts never
 * showed the problem — only pages did.
 *
 * `prepare: false` is kept so the connection still behaves if it is ever repointed at the
 * transaction pooler.
 */
const client =
  globalForDb.apexArchiveClient ??
  postgres(serverEnv().DATABASE_URL, {
    prepare: false,
    // One connection per process. `next build` prerenders with eleven parallel workers,
    // each holding its own pool, and Supabase's session pooler caps the project at fifteen
    // clients — anything larger fails the build with EMAXCONNSESSION.
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });

// Without this the dev server opens a new pool on every hot reload.
if (process.env.NODE_ENV !== "production") {
  globalForDb.apexArchiveClient = client;
}

export const db = drizzle(client, { schema });
