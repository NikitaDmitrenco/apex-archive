import { Container, Section } from "@/components/ui/container";

export default function Loading() {
  return (
    <Container>
      <Section aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading</span>
        <div className="bg-muted h-3 w-24 animate-pulse" />
        <div className="bg-muted mt-8 h-16 w-full max-w-xl animate-pulse" />
        <div className="bg-muted mt-8 h-4 w-full max-w-md animate-pulse" />
      </Section>
    </Container>
  );
}
