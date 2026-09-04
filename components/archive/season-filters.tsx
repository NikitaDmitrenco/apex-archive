"use client";

import { FilterBar, FilterSelect } from "@/components/archive/filter-bar";

type SeasonFiltersProps = {
  decades: number[];
  selected: {
    decade?: number;
  };
  resultCount: number;
};

export function SeasonFilters({
  decades,
  selected,
  resultCount,
}: SeasonFiltersProps) {
  const hasFilters = Object.values(selected).some(
    (value) => value !== undefined,
  );

  return (
    <FilterBar
      action="/seasons"
      hasFilters={hasFilters}
      resultCount={resultCount}
      countNoun={["season", "seasons"]}
    >
      <FilterSelect
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
      </FilterSelect>
    </FilterBar>
  );
}
