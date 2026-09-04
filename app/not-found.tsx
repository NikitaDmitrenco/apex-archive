import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container>
      <Section>
        <Eyebrow>404</Eyebrow>
        <Display as="h1" size="md" className="mt-6">
          Not in the archive
        </Display>
        <Lede className="mt-8">
          This page does not exist. It may have been moved, or it was never
          recorded here.
        </Lede>
        <div className="mt-10">
          <Button size="lg" asChild>
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </Section>
    </Container>
  );
}
