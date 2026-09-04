import Link from "next/link";

import type { CarListItem } from "@/lib/db/queries/cars";
import { formatEngine } from "@/lib/format";

/**
 * The image frame stays even when there is no image. The archive holds no car photography
 * yet, and an empty frame is honest about that where a hidden one would pretend the layout
 * was never meant to have one.
 */
export function CarCard({ car }: { car: CarListItem }) {
  const specs = [
    String(car.year),
    car.teamName,
    formatEngine(car.engineConfig, car.capacityLiters),
    car.powerHp ? `~${car.powerHp} hp` : null,
  ].filter((part): part is string => Boolean(part) && part !== "—");

  return (
    <article>
      <Link href={`/cars/${car.slug}`} className="group block">
        <div className="border-border bg-card relative aspect-16/10 overflow-hidden border">
          {car.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote host is not known until media lands
            <img
              src={car.imageUrl}
              alt={`${car.name}, ${car.year}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <span className="text-muted-foreground/50 absolute inset-0 flex items-center justify-center font-mono text-[0.65rem] tracking-[0.14em] uppercase">
              No image yet
            </span>
          )}
        </div>

        <h3 className="font-display group-hover:text-primary mt-5 text-2xl font-light tracking-[-0.01em] transition-colors">
          {car.name}
        </h3>

        <p className="text-muted-foreground mt-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          {specs.join(" · ")}
        </p>

        {car.dataConfidence !== "verified" ? (
          <p className="text-muted-foreground/60 mt-2 font-mono text-[0.6rem] tracking-[0.14em] uppercase">
            {car.dataConfidence} data
          </p>
        ) : null}
      </Link>
    </article>
  );
}
