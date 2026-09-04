"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";

export default function SeasonsError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <Container>
      <Section>
        <Eyebrow>Error</Eyebrow>
        <Display as="h1" size="md" className="mt-6">
          The seasons catalogue could not load
        </Display>
        <Lede className="mt-8">
          The archive could not load the seasons listing right now. Try again,
          or head back to the entrance.
        </Lede>
        {error.digest ? (
          <p className="spec-label text-muted-foreground mt-6">
            Reference {error.digest}
          </p>
        ) : null}
        <div className="mt-10 flex gap-3">
          <Button size="lg" onClick={retry}>
            Try again
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </Section>
    </Container>
  );
}
