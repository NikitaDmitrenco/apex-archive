"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import { ERAS, formatEraRange } from "@/lib/constants/eras";
import type { CarFilterOptions } from "@/lib/db/queries/cars";

type CarFiltersProps = {
  options: CarFilterOptions;
  selected: {
    era?: string;
    decade?: number;
    teamSlug?: string;
    year?: number;
    engineManufacturer?: string;
    driverSlug?: string;
    championshipWinning?: boolean;
  };
  resultCount: number;
};

const selectClass =
  "border-border bg-background text-foreground focus-visible:ring-ring w-full appearance-none border px-3 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase focus-visible:ring-2 focus-visible:outline-none";

const labelClass =
  "text-muted-foreground mb-2 block font-mono text-[0.65rem] tracking-[0.14em] uppercase";

function Field({
  label,
  name,
  value,
  placeholder,
  children,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={`filter-${name}`}>
        {label}
      </label>
      <select
        id={`filter-${name}`}
        name={name}
        defaultValue={value}
        className={selectClass}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    </div>
  );
}

export function CarFilters({
  options,
  selected,
  resultCount,
}: CarFiltersProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const decades = Array.from(
    new Set(options.years.map((year) => Math.floor(year / 10) * 10)),
  ).sort((a, b) => b - a);

  const hasFilters = Object.values(selected).some(
    (value) => value !== undefined && value !== false,
  );

  /**
   * The plain GET form is the fallback and works without scripting, but it submits every
   * empty select as `field=`. With JavaScript the same submission is intercepted and the
   * blanks dropped, so the URL only carries filters that are actually set.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    for (const [key, value] of new FormData(event.currentTarget).entries()) {
      if (typeof value === "string" && value !== "") params.set(key, value);
    }

    const query = params.toString();
    router.push(query ? `/cars?${query}` : "/cars");
  }

  return (
    <form
      ref={formRef}
      method="get"
      action="/cars"
      onSubmit={handleSubmit}
      onChange={() => formRef.current?.requestSubmit()}
      className="border-border border-b pb-10"
    >
      <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Field
          label="Era"
          name="era"
          value={selected.era ?? ""}
          placeholder="Any era"
        >
          {ERAS.map((era) => (
            <option key={era.slug} value={era.slug}>
              {era.label} · {formatEraRange(era)}
            </option>
          ))}
        </Field>

        <Field
          label="Decade"
          name="decade"
          value={selected.decade ? String(selected.decade) : ""}
          placeholder="Any decade"
        >
          {decades.map((decade) => (
            <option key={decade} value={decade}>
              {decade}s
            </option>
          ))}
        </Field>

        <Field
          label="Team"
          name="teamSlug"
          value={selected.teamSlug ?? ""}
          placeholder="Any team"
        >
          {options.teams.map((team) => (
            <option key={team.slug} value={team.slug}>
              {team.name}
            </option>
          ))}
        </Field>

        <Field
          label="Year"
          name="year"
          value={selected.year ? String(selected.year) : ""}
          placeholder="Any year"
        >
          {options.years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Field>

        <Field
          label="Engine"
          name="engineManufacturer"
          value={selected.engineManufacturer ?? ""}
          placeholder="Any engine"
        >
          {options.engineManufacturers.map((engine) => (
            <option key={engine} value={engine}>
              {engine}
            </option>
          ))}
        </Field>

        <Field
          label="Driver"
          name="driverSlug"
          value={selected.driverSlug ?? ""}
          placeholder="Any driver"
        >
          {options.drivers.map((driver) => (
            <option key={driver.slug} value={driver.slug}>
              {driver.fullName}
            </option>
          ))}
        </Field>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
        <label className="flex cursor-pointer items-center gap-3 font-mono text-[0.7rem] tracking-[0.12em] uppercase">
          <input
            type="checkbox"
            name="championshipWinning"
            value="true"
            defaultChecked={selected.championshipWinning ?? false}
            className="border-border accent-primary size-4 border"
          />
          Championship winners only
        </label>

        <div className="flex items-center gap-6">
          <span className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.12em] uppercase">
            {resultCount} {resultCount === 1 ? "car" : "cars"}
          </span>
          {/* Kept visible for anyone without scripting, where onChange cannot submit. */}
          <button
            type="submit"
            className="border-border hover:bg-accent focus-visible:ring-ring border px-4 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            Apply
          </button>
          {hasFilters ? (
            <Link
              href="/cars"
              className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.12em] uppercase transition-colors"
            >
              Reset
            </Link>
          ) : null}
        </div>
      </div>
    </form>
  );
}
