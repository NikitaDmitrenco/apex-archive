import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/archive/placeholder-page";

export const metadata: Metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <PlaceholderPage
      eyebrow="Search"
      title="Search the archive"
      description="One query across cars, drivers, teams, circuits and seasons, grouped by entity type."
      milestone="Milestone 9 — global search"
    />
  );
}
