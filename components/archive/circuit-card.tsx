import Link from "next/link";

import type { CircuitListItem } from "@/lib/db/queries/circuits";
import { orDash } from "@/lib/format";

function lengthLabel(value: number | null): string {
  return value === null ? orDash(null) : `${value.toFixed(3)} km`;
}

/**
 * The image frame stays even when there is no layout. The archive holds no circuit diagrams
 * yet, and an empty frame is honest about that where a hidden one would pretend the layout
 * was never meant to have one.
 */
export function CircuitCard({ circuit }: { circuit: CircuitListItem }) {
  return (
    <article>
      <Link href={`/circuits/${circuit.slug}`} className="group block">
        <div className="border-border bg-card relative aspect-16/9 overflow-hidden border">
          {circuit.layoutImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote host is not known until media lands
            <img
              src={circuit.layoutImageUrl}
              alt={`${circuit.name} layout`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <span className="text-muted-foreground/50 absolute inset-0 flex items-center justify-center font-mono text-[0.65rem] tracking-[0.14em] uppercase">
              No layout yet
            </span>
          )}
        </div>

        <h3 className="font-display group-hover:text-primary mt-5 text-2xl font-light tracking-[-0.01em] transition-colors">
          {circuit.name}
        </h3>

        <p className="text-muted-foreground mt-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          {circuit.country} · {lengthLabel(circuit.lengthKm)} ·{" "}
          {orDash(circuit.turns)} turns
        </p>

        {circuit.dataConfidence !== "verified" ? (
          <p className="text-muted-foreground/60 mt-2 font-mono text-[0.6rem] tracking-[0.14em] uppercase">
            {circuit.dataConfidence} data
          </p>
        ) : null}
      </Link>
    </article>
  );
}
