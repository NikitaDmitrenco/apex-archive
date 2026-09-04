"use client";

import Link from "next/link";
import { useTransition } from "react";

import { toggleFavorite } from "@/lib/db/queries/favorites";
import type { FavoriteEntityType } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

/**
 * Editorial "Save" toggle. Editorial restraint over polish: an outlined mono button with
 * a star character. Two states (saved / unsaved), one colour swap to indicate the change.
 *
 * Signed-out visitors see the same button but rendered as a link to /login — the toggle
 * server action requires a session and would otherwise throw.
 */
export function FavoriteButton({
  entityType,
  entityId,
  initialFavorited,
  signedIn,
}: {
  entityType: FavoriteEntityType;
  entityId: string;
  initialFavorited: boolean;
  signedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (!signedIn) {
    return (
      <Link
        href="/login"
        className="border-border hover:border-foreground inline-flex items-center px-3 py-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors"
      >
        ☆ Save
      </Link>
    );
  }

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    startTransition(async () => {
      await toggleFavorite(entityType, entityId, initialFavorited);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={initialFavorited}
      aria-label={
        initialFavorited ? "Remove from favorites" : "Save to favorites"
      }
      className={cn(
        "inline-flex items-center border px-3 py-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        initialFavorited
          ? "border-primary text-primary hover:border-foreground hover:text-foreground"
          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
      )}
    >
      {initialFavorited ? "★ Saved" : "☆ Save"}
    </button>
  );
}
