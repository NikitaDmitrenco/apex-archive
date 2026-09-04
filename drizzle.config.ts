import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

// Migrations run DDL, so they prefer the direct connection over the pooler.
// Left empty when unset so `drizzle-kit generate`, which needs no connection, still runs;
// `migrate` and `studio` will fail on connect until .env.local is filled in.
const url = process.env.DIRECT_URL || process.env.DATABASE_URL || "";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
