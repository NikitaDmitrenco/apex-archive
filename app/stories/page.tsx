import type { Metadata } from "next";

import { StoryCard } from "@/components/archive/story-card";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow, Lede } from "@/components/ui/typography";
import { listArticles } from "@/lib/db/queries/articles";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Editorial essays from the Apex Archive — context and commentary on the cars, drivers, regulations and history of Formula 1.",
};

export default async function StoriesPage() {
  const articles = await listArticles();

  return (
    <Container>
      <Section>
        <Eyebrow>Editorial</Eyebrow>
        <Display as="h1" size="lg" className="mt-6">
          Stories
        </Display>
        <Lede className="mt-8">
          Editorial essays from the archive. Context and commentary on the
          machines, the regulations and the history that the rest of the site
          records.
        </Lede>
      </Section>

      <Section className="pt-0">
        {articles.length > 0 ? (
          <div className="grid gap-x-10 gap-y-12 md:grid-cols-2">
            {articles.map((article) => (
              <StoryCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <div className="border-border border-t pt-12">
            <Display as="p" size="sm">
              No stories published yet.
            </Display>
            <p className="text-muted-foreground mt-6 max-w-md leading-relaxed">
              The Stories section surfaces curated long-form pieces from the
              editorial side of the archive. New entries land here as they are
              published.
            </p>
          </div>
        )}
      </Section>
    </Container>
  );
}
