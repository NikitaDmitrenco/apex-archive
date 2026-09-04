import Link from "next/link";

export type AssistantToolResult = {
  tool: string;
  args: unknown;
  result: unknown;
};

export type AssistantResultPayload = {
  answer: string;
  toolResults: AssistantToolResult[];
};

/**
 * Renders a minimal-markdown subset of the model's answer. We deliberately do NOT pipe
 * the model's raw output through an HTML renderer: an LLM is not a content source of
 * truth and we want the rendering surface to be tight. The assistant is asked to write
 * markdown links of the form `[Name](/cars/...)` so a small converter covers the only
 * interactive output it produces.
 *
 * The "Tools used" disclosure reveals which queries were run — useful for trust and
 * debugging without bloating the main reading surface.
 */
export function AssistantResults({
  result,
}: {
  result: AssistantResultPayload;
}) {
  return (
    <div className="mt-14">
      <AnswerText text={result.answer} />

      {result.toolResults.length > 0 ? (
        <details className="border-border mt-12 border-t pt-6">
          <summary className="text-muted-foreground hover:text-foreground cursor-pointer font-mono text-[0.7rem] tracking-[0.14em] uppercase transition-colors">
            Tools used · {String(result.toolResults.length).padStart(2, "0")}
          </summary>
          <ul className="mt-6 space-y-4">
            {result.toolResults.map((tr, index) => (
              <li
                key={`${tr.tool}-${index}`}
                className="border-border border-b pb-4"
              >
                <p className="font-mono text-[0.7rem] tracking-[0.14em] uppercase">
                  {tr.tool}
                </p>
                <pre className="text-muted-foreground mt-2 overflow-x-auto font-mono text-[0.7rem] leading-relaxed">
                  {JSON.stringify(
                    { args: tr.args, result: tr.result },
                    null,
                    2,
                  )}
                </pre>
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

/**
 * Convert the assistant's limited markdown output to a sequence of typed segments, then
 * render them as plain JSX. Anything more complex than a paragraph plus `[label](href)`
 * links falls back to plain text — the assistant prompt asks for those two primitives
 * only.
 */
function AnswerText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="max-w-2xl space-y-6">
      {blocks.map((block, blockIndex) => {
        const segments = parseInlineMarkdown(block);
        return (
          <p
            key={blockIndex}
            className="font-display text-xl leading-relaxed font-light tracking-[-0.01em] md:text-2xl"
          >
            {segments.map((segment, segmentIndex) => {
              if (segment.type === "link") {
                return (
                  <Link
                    key={segmentIndex}
                    href={segment.href}
                    className="text-primary underline-offset-4 transition-opacity hover:opacity-80"
                  >
                    {segment.label}
                  </Link>
                );
              }
              return <span key={segmentIndex}>{segment.text}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

type InlineSegment =
  | { type: "text"; text: string }
  | {
      type: "link";
      label: string;
      href: string;
    };

function parseInlineMarkdown(input: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: "text",
        text: input.slice(lastIndex, match.index),
      });
    }
    segments.push({ type: "link", label: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    segments.push({ type: "text", text: input.slice(lastIndex) });
  }

  return segments;
}
