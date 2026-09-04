import Link from "next/link";

import { StoryTags } from "@/components/archive/story-tags";
import type { ArticleListItem } from "@/lib/db/queries/articles";

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
 * Index card for an article. No cover image — the section ships without one and would
 * rather show an empty frame than invent a stand-in. A grid of these reads as a quiet
 * editorial list rather than a feed.
 */
export function StoryCard({ article }: { article: ArticleListItem }) {
  const dateLabel = formatPublishedDate(article.publishedAt);

  return (
    <article className="border-border border-t pt-6">
      <Link href={`/stories/${article.slug}`} className="group block">
        {dateLabel ? (
          <p className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
            {dateLabel}
          </p>
        ) : null}

        <h3 className="font-display group-hover:text-primary mt-4 text-2xl font-light tracking-[-0.01em] transition-colors md:text-3xl">
          {article.title}
        </h3>

        {article.subtitle ? (
          <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
            {article.subtitle}
          </p>
        ) : null}

        {article.tags && article.tags.length > 0 ? (
          <div className="mt-5">
            <StoryTags tags={article.tags} />
          </div>
        ) : null}
      </Link>
    </article>
  );
}
