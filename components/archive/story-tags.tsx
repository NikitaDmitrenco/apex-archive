/**
 * Small editorial chip for an article's tags. Renders nothing for an empty list so callers
 * can pass whatever shape `articles.tags` arrives in without a guard.
 */
export function StoryTags({ tags }: { tags: string[] | null | undefined }) {
  if (!tags || tags.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="text-muted-foreground border-border rounded-sm border px-2 py-0.5 font-mono text-[0.6rem] tracking-[0.14em] uppercase"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
