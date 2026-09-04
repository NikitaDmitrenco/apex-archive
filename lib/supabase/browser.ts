import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | undefined;

/**
 * Browser-side Supabase client. The library's `createBrowserClient` already maintains a
 * singleton internally, but the module-level cache keeps us from depending on its
 * implementation detail and keeps `createClient` call sites identical to the server version.
 *
 * Reads `process.env.NEXT_PUBLIC_SUPABASE_URL` and `_ANON_KEY` directly: Next.js inlines
 * `NEXT_PUBLIC_*` at build time, so the empty strings below are only seen when the project
 * has not been provisioned for Auth yet. In that state the client throws on first use,
 * which is the right place to surface a missing config rather than swallowing it here.
 */
export function createClient(): SupabaseClient {
  if (cached) return cached;

  cached = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  );
  return cached;
}
