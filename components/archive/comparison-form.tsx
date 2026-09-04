"use client";

import { useRouter } from "next/navigation";
import { type FormEvent } from "react";

import { FilterSelect } from "@/components/archive/filter-bar";

export type ComparisonCarOption = {
  slug: string;
  name: string;
  year: number;
  teamName: string;
};

/**
 * Two car selectors backed by GET form semantics, so the comparison works with scripting
 * disabled. The script path intercepts submit to drop blank fields and push the URL via
 * the client router — empty selects would otherwise submit as `field=` and clutter the
 * shareable link.
 */
export function ComparisonForm({
  allCars,
  initialA,
  initialB,
}: {
  allCars: ComparisonCarOption[];
  initialA?: string;
  initialB?: string;
}) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget).entries()) {
      if (typeof value === "string" && value !== "") params.set(key, value);
    }

    const query = params.toString();
    router.push(query ? `/compare?${query}` : "/compare");
  }

  return (
    <form
      method="get"
      action="/compare"
      onSubmit={handleSubmit}
      className="border-border border-b pb-10"
    >
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
        <FilterSelect
          label="Car A"
          name="a"
          value={initialA ?? ""}
          placeholder="Choose first car"
        >
          {allCars.map((car) => (
            <option key={`a-${car.slug}`} value={car.slug}>
              {car.name} · {car.year} · {car.teamName}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="Car B"
          name="b"
          value={initialB ?? ""}
          placeholder="Choose second car"
        >
          {allCars.map((car) => (
            <option key={`b-${car.slug}`} value={car.slug}>
              {car.name} · {car.year} · {car.teamName}
            </option>
          ))}
        </FilterSelect>
      </div>

      <div className="mt-8 flex items-center justify-end">
        <button
          type="submit"
          className="border-border hover:bg-accent focus-visible:ring-ring border px-5 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          Compare
        </button>
      </div>
    </form>
  );
}
