import Link from "next/link";

import { Container } from "@/components/ui/container";
import { allNavItems } from "@/lib/constants/navigation";

export function SiteFooter() {
  return (
    <footer className="border-border mt-auto border-t">
      <Container>
        <div className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium tracking-[0.28em] uppercase">
              Apex
            </p>
            <p className="text-muted-foreground mt-3 max-w-xs text-sm leading-relaxed">
              The machines. The drivers. The circuits. The stories.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
              {allNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-border text-muted-foreground border-t py-6 font-mono text-[0.7rem] tracking-[0.12em] uppercase">
          Formula 1 · 1950 — 2026
        </div>
      </Container>
    </footer>
  );
}
