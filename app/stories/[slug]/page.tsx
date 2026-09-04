import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/archive/markdown";
import { Container, Section } from "@/components/ui/container";
import { Display, Eyebrow } from "@/components/ui/typography";
import {
  getArticleBySlug,
  listArticleSlugs,
  listArticles,
} from "@/lib/db/queries/articles";
import { buildMetadata } from "@/lib/seo";

/**
 * Every published article is prerendered and anything else is refused by the router.
 *
 * The same 404 problem that bit the cars and seasons detail pages applies here: async
 * metadata streams the response and the 200 status leaves before the page reaches
 * notFound(). Forcing every slug through the routing layer returns a real 404. See
 * PROJECT_STATE "Failed approaches" #13.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await listArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/stories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Story not found" };

  return buildMetadata({
    title: article.title,
    description:
      article.subtitle ??
      `An editorial piece in the Apex Archive: ${article.title}.`,
    path: `/stories/${article.slug}`,
  });
}

function formatPublishedDate(value: Date | string | null): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Read time at 200 wpm with a tilde. The archive does not record a separate field and a
 * precise figure would pretend to a level of measurement the section does not have.
 */
function estimateReadMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function StoryDetailPage({
  params,
}: PageProps<"/stories/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const tags = article.tags ?? [];
  const publishedLabel = formatPublishedDate(article.publishedAt);
  const readMinutes = estimateReadMinutes(article.body);

  // Three more stories, newest first, excluding the current piece. Drawn from the same
  // list the index page uses, so the order matches and the cache is shared.
  const all = await listArticles();
  const more = all.filter((entry) => entry.slug !== article.slug).slice(0, 3);

  return (
    <Container>
      <Section>
        <Eyebrow>
          {tags.length > 0 ? <>Editorial · {tags.join(" · ")}</> : "Editorial"}
        </Eyebrow>

        <Display as="h1" size="lg" className="mt-6">
          {article.title}
        </Display>

        {article.subtitle ? (
          <p className="text-muted-foreground mt-6 max-w-2xl text-lg leading-relaxed">
            {article.subtitle}
          </p>
        ) : null}

        <div className="text-muted-foreground mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          {publishedLabel ? <span>{publishedLabel}</span> : null}
          {publishedLabel ? <span aria-hidden="true">·</span> : null}
          <span>≈ {readMinutes} min read</span>
        </div>

        <article className="mt-16 max-w-2xl">
          <Markdown body={article.body} />
        </article>

        {more.length > 0 ? (
          <div className="mt-24">
            <Eyebrow>More stories</Eyebrow>
            <ul className="mt-8 grid gap-8 md:grid-cols-3">
              {more.map((entry) => (
                <li key={entry.slug}>
                  <Link href={`/stories/${entry.slug}`} className="group block">
                    <p className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                      {formatPublishedDate(entry.publishedAt)}
                    </p>
                    <p className="font-display group-hover:text-primary mt-3 text-xl font-light tracking-[-0.01em] transition-colors">
                      {entry.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-border mt-20 border-t pt-8">
          <Link
            href="/stories"
            className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors"
          >
            Back to all stories
          </Link>
        </div>
      </Section>
    </Container>
  );
}
