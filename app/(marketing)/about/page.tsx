import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/archive/placeholder-page";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="About"
      title="A digital archive of Formula 1"
      description="What this archive is, where its data comes from, and how it is put together."
      milestone="Milestone 11 — editorial content"
    />
  );
}
