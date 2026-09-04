"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import {
  AssistantResults,
  type AssistantResultPayload,
} from "./assistant-results";

const MAX_QUESTION_LENGTH = 500;

/**
 * The assistant's input form. Plain client component — submits to `/api/assistant`,
 * renders the result inline below the textarea. We deliberately do not use the
 * `useTransition` debounce pattern from the search form: an LLM call is a deliberate,
 * expensive request, not a keystroke-driven filter, so the user explicitly presses a
 * button to fire it.
 */
export function AssistantForm() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssistantResultPayload | undefined>();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    setError(null);
    setResult(undefined);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      const payload = (await response.json()) as
        AssistantResultPayload | { error: string };

      if (!response.ok || "error" in payload) {
        const message =
          "error" in payload && typeof payload.error === "string"
            ? payload.error
            : "The assistant did not respond.";
        setError(message);
      } else {
        setResult(payload);
        // Re-render the server shell so the cached response can be revisited. Cheap and
        // keeps the URL meaningful.
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Network error talking to the assistant.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="border-border border-b pb-10">
        <label htmlFor="assistant-question" className="sr-only">
          Ask the archive
        </label>
        <textarea
          id="assistant-question"
          name="question"
          required
          maxLength={MAX_QUESTION_LENGTH}
          rows={4}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask the archive — 'Show me Ferrari cars that won the championship between 1990 and 2010'."
          className="font-display text-foreground placeholder:text-muted-foreground/60 focus:border-primary border-foreground/20 w-full resize-y border-0 border-b bg-transparent px-1 py-4 text-2xl font-light tracking-[-0.01em] transition-colors focus:outline-none md:text-3xl"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="text-muted-foreground font-mono text-[0.7rem] tracking-[0.14em] uppercase">
            {question.length} / {MAX_QUESTION_LENGTH}
          </p>
          <button
            type="submit"
            disabled={submitting || question.trim().length === 0}
            className="border-border hover:bg-accent focus-visible:ring-ring disabled:text-muted-foreground border px-5 py-2 font-mono text-[0.7rem] tracking-[0.12em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Asking…" : "Ask"}
          </button>
        </div>
      </form>

      {error ? (
        <div className="border-border mt-10 border-t pt-10">
          <p className="font-display text-2xl font-light tracking-[-0.01em] md:text-3xl">
            {error}
          </p>
          <p className="text-muted-foreground mt-4 max-w-2xl leading-relaxed">
            If the assistant is not configured yet, set{" "}
            <code className="font-mono">OPENAI_API_KEY</code> in{" "}
            <code className="font-mono">.env.local</code> and reload.
          </p>
        </div>
      ) : null}

      {result ? <AssistantResults result={result} /> : null}
    </div>
  );
}
