import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/archive/placeholder-page";

export const metadata: Metadata = {
  title: "Teams",
};

export default function TeamsPage() {
  return (
    <PlaceholderPage
      eyebrow="Archive"
      title="Teams"
      description="The constructors, their championships, and the cars and drivers that carried them."
      milestone="Milestone 6 — teams catalogue"
    />
  );
}
