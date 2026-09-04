"use client";

import { FilterBar, FilterSelect } from "@/components/archive/filter-bar";

type CircuitFiltersProps = {
  options: {
    countries: string[];
    years: number[];
  };
  selected: {
    country?: string;
    hostedInYear?: number;
  };
  resultCount: number;
};

export function CircuitFilters({
  options,
  selected,
  resultCount,
}: CircuitFiltersProps) {
  const hasFilters = Object.values(selected).some(
    (value) => value !== undefined && value !== "",
  );

  return (
    <FilterBar
      action="/circuits"
      hasFilters={hasFilters}
      resultCount={resultCount}
      countNoun={["circuit", "circuits"]}
    >
      <FilterSelect
        label="Country"
        name="country"
        value={selected.country ?? ""}
        placeholder="Any country"
      >
        {options.countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        label="Hosted in"
        name="hostedInYear"
        value={selected.hostedInYear ? String(selected.hostedInYear) : ""}
        placeholder="Any season"
      >
        {options.years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </FilterSelect>
    </FilterBar>
  );
}
