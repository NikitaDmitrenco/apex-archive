"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, type FormEvent } from "react";

const DEBOUNCE_MS = 250;

type SearchFormProps = {
  /** Current `?q=` value, already trimmed. */
  initialQuery: string;
};

/**
 * A plain GET form so the page is still searchable with scripting disabled. Where JS is
 * available the typing path goes through `router.push` after a short debounce so the
 * page streams fresh results without an extra click. Submitting the form (Enter key) is
 * intercepted for the same reason — empty submissions collapse to a clean `/search`.
 */
export function SearchForm({ initialQuery }: SearchFormProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [value, setValue] = useState(initialQuery);

  // Debounce typing into a router.push. The effect reads `value`, not `initialQuery`, so
  // it does not need to sync state with props after the URL changes — the parent forces a
  // remount via `key` instead, sidestepping the react-hooks/set-state-in-effect rule.
  useEffect(() => {
    const trimmed = value.trim();
    const target = trimmed
      ? `/search?q=${encodeURIComponent(trimmed)}`
      : "/search";

    // Skip the first paint: initialQuery already reflects the current URL, so re-pushing
    // would only trigger an extra re-render without changing anything.
    if (trimmed === initialQuery.trim()) return;

    const handle = window.setTimeout(() => {
      startTransition(() => {
        router.push(target);
      });
    }, DEBOUNCE_MS);

    return () => window.clearTimeout(handle);
  }, [value, initialQuery, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    const target = trimmed
      ? `/search?q=${encodeURIComponent(trimmed)}`
      : "/search";
    router.push(target);
  }

  function handleClear() {
    setValue("");
    router.push("/search");
  }

  return (
    <form role="search" action="/search" method="get" onSubmit={handleSubmit}>
      <div className="relative">
        <label htmlFor="archive-search" className="sr-only">
          Search the archive
        </label>
        <input
          id="archive-search"
          type="search"
          name="q"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search the archive…"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="font-display text-foreground placeholder:text-muted-foreground/60 focus:border-primary border-foreground/20 w-full border-0 border-b bg-transparent px-1 py-4 text-2xl font-light tracking-[-0.01em] transition-colors focus:outline-none md:text-4xl"
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-1/2 right-0 -translate-y-1/2 px-2 py-1 font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            ×
          </button>
        ) : null}
      </div>
    </form>
  );
}
