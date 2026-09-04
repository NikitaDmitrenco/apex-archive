import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/archive/placeholder-page";

export const metadata: Metadata = {
  title: "Circuits",
};

export default function CircuitsPage() {
  return (
    <PlaceholderPage
      eyebrow="Archive"
      title="Circuits"
      description="The tracks themselves — layouts, lengths, lap records and the races they have held."
      milestone="Milestone 7 — circuits catalogue"
    />
  );
}
