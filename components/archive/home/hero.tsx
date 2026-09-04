import { Container } from "@/components/ui/container";
import { Display, Eyebrow } from "@/components/ui/typography";

type HeroProps = {
  earliestYear: number | null;
  latestYear: number | null;
};

export function Hero({ earliestYear, latestYear }: HeroProps) {
  const range =
    earliestYear && latestYear ? `${earliestYear} — ${latestYear}` : null;

  return (
    <section className="border-border relative flex min-h-[88vh] flex-col justify-between border-b pt-16 pb-10">
      <Container className="flex flex-1 flex-col justify-center">
        <Eyebrow>{range ? `Formula 1 · ${range}` : "Formula 1"}</Eyebrow>
        <Display as="h1" size="hero" className="mt-8">
          Apex
          <br />
          Archive
        </Display>
        <p className="text-muted-foreground mt-10 max-w-md text-lg leading-relaxed">
          The machines. The drivers. The circuits. The stories.
        </p>
      </Container>

      <Container>
        <div className="text-muted-foreground border-border flex flex-wrap items-center justify-between gap-4 border-t pt-6 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          <span>An archive of the fastest sport in the world</span>
          <span aria-hidden="true">Scroll</span>
        </div>
      </Container>
    </section>
  );
}
