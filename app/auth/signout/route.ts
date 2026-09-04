import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * POST endpoint that signs the user out and redirects home. Kept as a Route Handler rather
 * than a server action so a no-JS form submission from the account page can still sign out
 * cleanly.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/", request.url));
}
