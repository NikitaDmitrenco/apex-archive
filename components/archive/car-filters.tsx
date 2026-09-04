"use client";

import {
  FilterBar,
  FilterSelect,
  FilterToggle,
} from "@/components/archive/filter-bar";
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

export function CarFilters({
  options,
  selected,
  resultCount,
}: CarFiltersProps) {
  const decades = Array.from(
    new Set(options.years.map((year) => Math.floor(year / 10) * 10)),
  ).sort((a, b) => b - a);

  const hasFilters = Object.values(selected).some(
    (value) => value !== undefined && value !== false,
  );

  return (
    <FilterBar
      action="/cars"
      hasFilters={hasFilters}
      resultCount={resultCount}
      countNoun={["car", "cars"]}
      toggles={
        <FilterToggle
          name="championshipWinning"
          label="Championship winners only"
          checked={selected.championshipWinning ?? false}
        />
      }
    >
      <FilterSelect
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
      </FilterSelect>

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
      </FilterSelect>

      <FilterSelect
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
      </FilterSelect>

      <FilterSelect
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
      </FilterSelect>
    </FilterBar>
  );
}
