import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  /** Milestone that will replace this placeholder with the real page. */
  milestone: string;
};

/**
 * Temporary shell used by every route until its milestone lands. Delete each usage as the
 * real page is built; remove this file once none remain.
 */
export function PlaceholderPage({
  eyebrow,
  title,
  description,
  milestone,
}: PlaceholderPageProps) {
  return (
    <Container>
      <Section>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          {title}
        </Display>
        <Lede className="mt-8">{description}</Lede>
        <p className="spec-label text-muted-foreground border-border mt-12 border-t pt-6">
          {milestone}
        </p>
      </Section>
    </Container>
  );
}
