import { Container, Section } from "@/components/ui/container";
import { Display } from "@/components/ui/typography";

export function EditorialStatement() {
  return (
    <Section className="border-border border-b">
      <Container>
        <Display as="p" size="lg" className="max-w-4xl">
          The fastest sport in the world has a long memory.
        </Display>
      </Container>
    </Section>
  );
}
