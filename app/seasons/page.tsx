import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/archive/placeholder-page";

export const metadata: Metadata = {
  title: "Seasons",
};

export default function SeasonsPage() {
  return (
    <PlaceholderPage
      eyebrow="Archive"
      title="Seasons"
      description="Every championship season from 2026 back to 1950, with champions, calendars and standings."
      milestone="Milestone 8 — seasons archive"
    />
  );
}
