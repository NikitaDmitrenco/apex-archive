import type { Metadata } from "next";

import { ErasTimeline } from "@/components/archive/eras-timeline";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import { listSeasonYears } from "@/lib/db/queries/seasons";

export const metadata: Metadata = {
  title: "Eras",
  description:
    "Formula 1 as a sequence of regulation eras — from the front-engine championship of 1950 to the new technical regulations of 2026.",
};

export default async function ErasPage() {
  const seasonYears = await listSeasonYears();

  return (
    <Container>
      <Section>
        <Eyebrow>History</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          Formula 1, by era.
        </Display>
        <Lede className="mt-8">
          The technical regulations shape everything: the cars, the racing, the
          records. This is the sport as a sequence of rule eras.
        </Lede>
      </Section>

      <ErasTimeline seasonYears={seasonYears} />
    </Container>
  );
}
