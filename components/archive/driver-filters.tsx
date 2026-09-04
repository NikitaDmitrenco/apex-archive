"use client";

import {
  FilterBar,
  FilterSelect,
  FilterToggle,
} from "@/components/archive/filter-bar";
import type { DriverFilterOptions } from "@/lib/db/queries/drivers";

type DriverFiltersProps = {
  options: DriverFilterOptions;
  selected: {
    nationality?: string;
    teamSlug?: string;
    activeInYear?: number;
    activeOnly?: boolean;
    championsOnly?: boolean;
  };
  resultCount: number;
};

export function DriverFilters({
  options,
  selected,
  resultCount,
}: DriverFiltersProps) {
  const hasFilters = Object.values(selected).some(
    (value) => value !== undefined && value !== false,
  );

  return (
    <FilterBar
      action="/drivers"
      hasFilters={hasFilters}
      resultCount={resultCount}
      countNoun={["driver", "drivers"]}
      toggles={
        <>
          <FilterToggle
            name="championsOnly"
            label="World champions only"
            checked={selected.championsOnly ?? false}
          />
          <FilterToggle
            name="activeOnly"
            label="Still racing"
            checked={selected.activeOnly ?? false}
          />
        </>
      }
    >
      <FilterSelect
        label="Nationality"
        name="nationality"
        value={selected.nationality ?? ""}
        placeholder="Any nationality"
      >
        {options.nationalities.map((nationality) => (
          <option key={nationality} value={nationality}>
            {nationality}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
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
      </FilterSelect>

      <FilterSelect
        label="Raced in"
        name="activeInYear"
        value={selected.activeInYear ? String(selected.activeInYear) : ""}
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
