import { createClient } from "@/lib/supabase/server";

/**
 * Returns the currently signed-in user, or `null` if the session cookie is absent or
 * expired. Use `supabase.auth.getUser` rather than `getSession` — getSession reads from
 * cookies and trusts the embedded user object, while getUser revalidates against the
 * Auth server, which is the safe pattern for any authorization decision.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
