import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/archive/placeholder-page";

export const metadata: Metadata = {
  title: "Drivers",
};

export default function DriversPage() {
  return (
    <PlaceholderPage
      eyebrow="Archive"
      title="Drivers"
      description="The people who drove the machines, from the first championship season to the present day."
      milestone="Milestone 5 — drivers catalogue"
    />
  );
}
