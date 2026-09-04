import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Supabase Auth redirects here after the user clicks the confirmation link in their email.
 * The session has already been written to cookies by Supabase's hosted handler; we simply
 * bounce the user to /login so they can sign in normally.
 *
 * PKCE-style flows land here with a `code` query param that we must exchange for a session;
 * passwordless / magic-link flows carry the session directly and need no exchange.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/login";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirect(next);
    }
  }

  redirect("/login?error=Email confirmation failed. Try the link again.");
}
