import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";

export default function HomePage() {
  return (
    <Container>
      <Section className="flex min-h-[70vh] flex-col justify-center">
        <Eyebrow>Formula 1 · 1950 — 2026</Eyebrow>
        <Display as="h1" size="hero" className="mt-8">
          Apex
          <br />
          Archive
        </Display>
        <Lede className="mt-10">
          The machines. The drivers. The circuits. The stories.
        </Lede>
        <p className="spec-label text-muted-foreground border-border mt-16 border-t pt-6">
          Milestone 3 — landing page
        </p>
      </Section>
    </Container>
  );
}
