"use client";

import { useTransition } from "react";

import { signOut } from "@/lib/auth/actions";

/**
 * Plain sign-out button. Uses a transition so the button stays disabled until Supabase
 * finishes clearing the session, avoiding a flicker where the user clicks twice.
 */
export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await signOut();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="border-border hover:border-foreground border px-4 py-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors disabled:pointer-events-none disabled:opacity-50"
    >
      Sign out
    </button>
  );
}
