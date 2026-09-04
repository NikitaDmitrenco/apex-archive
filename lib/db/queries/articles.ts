import { and, desc, eq, isNotNull, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { articles, type Article } from "@/lib/db/schema";

export type ArticleListItem = Pick<
  Article,
  "slug" | "title" | "subtitle" | "publishedAt" | "tags"
>;

/**
 * Published articles, newest first. An article without `publishedAt` is treated as a draft
 * and never surfaces to readers — `published_at IS NULL` is the editorial signal, not the
 * database default.
 */
export async function listArticles(): Promise<ArticleListItem[]> {
  return db
    .select({
      slug: articles.slug,
      title: articles.title,
      subtitle: articles.subtitle,
      publishedAt: articles.publishedAt,
      tags: articles.tags,
    })
    .from(articles)
    .where(isNotNull(articles.publishedAt))
    .orderBy(desc(articles.publishedAt));
}

/**
 * Single article by slug. Returns null for unknown slugs — the page decides whether to
 * 404 or render an empty state, and the index never throws on missing rows.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const row = await db.query.articles.findFirst({
    where: and(eq(articles.slug, slug), isNotNull(articles.publishedAt)),
  });

  return row ?? null;
}

/**
 * Slugs of every published article. Used by `generateStaticParams` to prerender the
 * single-article routes and refuse everything else at the routing layer.
 */
export async function listArticleSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(isNotNull(articles.publishedAt));
  return rows.map((row) => row.slug);
}

/**
 * Distinct tag set across published articles. Useful if the section grows into tag
 * filtering later — for now it's wired up but not yet surfaced in the UI.
 */
export async function listArticleTags(): Promise<string[]> {
  const rows = await db
    .select({ tag: sql<string>`unnest(${articles.tags})` })
    .from(articles)
    .where(isNotNull(articles.publishedAt));

  const unique = new Set<string>();
  for (const row of rows) {
    if (row.tag) unique.add(row.tag);
  }
  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}
