import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client. Each request must build its own — reusing a client across
 * requests would leak session cookies between users.
 *
 * The cookie adapter honours the rule from `@supabase/ssr`: `getAll`/`setAll` only. `setAll`
 * is wrapped in try/catch because Next.js Server Components cannot write cookies; the
 * Proxy (`proxy.ts`) handles session refresh, so dropping the write there is harmless.
 */
export async function createClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component — the Proxy refreshes the session
            // and writes cookies on the response, so this branch is expected.
          }
        },
      },
    },
  );
}
