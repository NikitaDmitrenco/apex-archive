import type { Metadata } from "next";

import { AssistantForm } from "./assistant-form";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Assistant",
  description:
    "Ask the Apex Archive in plain language. The assistant uses the same queries the site uses, so what you see is in the database.",
};

export default function AssistantPage() {
  return (
    <Container>
      <Section>
        <Eyebrow>Archive</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          Assistant
        </Display>
        <Lede className="mt-8">
          Ask a question across the archive in plain language. The assistant
          uses the same queries the site uses, so what you see is in the
          database.
        </Lede>

        <div className="mt-14">
          <AssistantForm />
        </div>

        <p className="text-muted-foreground mt-12 max-w-2xl leading-relaxed">
          The assistant does not browse the web. It picks the query shape
          closest to your question, runs it against the archive, and writes a
          short editorial answer that links to the entities it found. If a
          real-world fact is not in the archive, it says so rather than guess.
        </p>
      </Section>
    </Container>
  );
}
