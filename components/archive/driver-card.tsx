import Link from "next/link";

import type { DriverListItem } from "@/lib/db/queries/drivers";
import { orDash } from "@/lib/format";

function careerSpan(driver: DriverListItem): string {
  if (!driver.careerStartYear) return orDash(null);
  return `${driver.careerStartYear} — ${driver.careerEndYear ?? "Present"}`;
}

export function DriverCard({ driver }: { driver: DriverListItem }) {
  return (
    <article>
      <Link href={`/drivers/${driver.slug}`} className="group block">
        <div className="border-border bg-card relative aspect-3/4 overflow-hidden border">
          {driver.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote host is not known until media lands
            <img
              src={driver.photoUrl}
              alt={driver.fullName}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          ) : (
            <span className="text-muted-foreground/50 absolute inset-0 flex items-center justify-center font-mono text-[0.65rem] tracking-[0.14em] uppercase">
              No portrait yet
            </span>
          )}
        </div>

        <h3 className="font-display group-hover:text-primary mt-5 text-2xl font-light tracking-[-0.01em] transition-colors">
          {driver.fullName}
        </h3>

        <p className="text-muted-foreground mt-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          {driver.nationality} · {careerSpan(driver)}
        </p>

        {driver.championships ? (
          <p className="text-primary mt-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
            {driver.championships}× World Champion
          </p>
        ) : null}
      </Link>
    </article>
  );
}
