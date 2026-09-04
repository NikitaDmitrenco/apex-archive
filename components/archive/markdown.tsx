import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

import { cn } from "@/lib/utils";

/**
 * Editorial markdown for article bodies. We do not need a full CommonMark renderer for
 * headings, paragraphs, lists, emphasis and links, which is everything the Stories section
 * uses today. `marked` is small and fast; DOMPurify is the security gate that prevents
 * stored markdown from rendering as live HTML. Sanitisation is non-negotiable even though
 * the body is editorially controlled: it lets future authors paste content from elsewhere
 * without re-deriving the safe subset each time.
 *
 * Rendered server-side: the article view is a server component, so the output is plain
 * HTML in the response and `dangerouslySetInnerHTML` is just the wiring.
 */
function renderMarkdown(body: string): string {
  const html = marked.parse(body, {
    gfm: true,
    breaks: false,
    async: false,
  });
  return DOMPurify.sanitize(html);
}

export function Markdown({
  body,
  className,
}: {
  body: string;
  className?: string;
}) {
  const html = renderMarkdown(body);

  return (
    <div
      className={cn("article-body", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
