import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/archive/placeholder-page";

export const metadata: Metadata = {
  title: "Cars",
};

export default function CarsPage() {
  return (
    <PlaceholderPage
      eyebrow="Archive"
      title="Cars"
      description="Every machine in the archive, filterable by era, decade, team, year, engine and championship record."
      milestone="Milestone 4 — cars catalogue"
    />
  );
}
