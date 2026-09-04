"use client";

import {
  FilterBar,
  FilterSelect,
  FilterToggle,
} from "@/components/archive/filter-bar";

type TeamFiltersProps = {
  nationalities: string[];
  selected: {
    nationality?: string;
    activeOnly?: boolean;
    championsOnly?: boolean;
  };
  resultCount: number;
};

export function TeamFilters({
  nationalities,
  selected,
  resultCount,
}: TeamFiltersProps) {
  const hasFilters = Object.values(selected).some(
    (value) => value !== undefined && value !== false,
  );

  return (
    <FilterBar
      action="/teams"
      hasFilters={hasFilters}
      resultCount={resultCount}
      countNoun={["team", "teams"]}
      toggles={
        <>
          <FilterToggle
            name="championsOnly"
            label="Championship winners only"
            checked={selected.championsOnly ?? false}
          />
          <FilterToggle
            name="activeOnly"
            label="Still competing"
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
        {nationalities.map((nationality) => (
          <option key={nationality} value={nationality}>
            {nationality}
          </option>
        ))}
      </FilterSelect>
    </FilterBar>
  );
}
