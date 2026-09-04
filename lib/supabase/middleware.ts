import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase Auth session on every request handled by the Proxy.
 *
 * The Supabase docs are explicit: token refresh must happen once per request, before any
 * Server Component runs, so refreshed cookies are available downstream. The pattern is:
 *
 *   1. Build a request-scoped Supabase client whose cookie store reads from `request`.
 *   2. Call `getUser()` — this triggers the lazy session initialiser inside the library,
 *      which may issue a refresh-token exchange and call `setAll` with the new cookies.
 *   3. Forward those cookies back via `supabaseResponse.cookies.set` so the browser sees
 *      them, and onto `request.cookies.set` so Server Components running in this request
 *      see the refreshed session and don't refresh again.
 *
 * If Supabase env vars are not configured the client is never instantiated — the Proxy
 * passes through as a plain `NextResponse.next()`, leaving the rest of the site usable.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Trigger lazy session init / token refresh. `getUser` revalidates the session against
  // the Auth server, which is what writes new cookies via the setAll handler above.
  await supabase.auth.getUser();

  return supabaseResponse;
}
