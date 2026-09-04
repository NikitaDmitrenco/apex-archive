"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Container } from "@/components/ui/container";
import {
  archiveNav,
  utilityNav,
  type NavItem,
} from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {item.label}
    </Link>
  );
}

export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="border-border bg-background sticky top-0 z-40 border-b">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="text-sm font-medium tracking-[0.28em] uppercase"
          >
            Apex
          </Link>

          <nav aria-label="Primary" className="hidden items-center md:flex">
            <ul className="flex items-center gap-7">
              {archiveNav.map((item) => (
                <li key={item.href}>
                  <NavLink item={item} active={isActive(item.href)} />
                </li>
              ))}
            </ul>
            <span className="bg-border mx-6 h-3 w-px" aria-hidden="true" />
            <ul className="flex items-center gap-7">
              {utilityNav
                .filter((item) => !item.mobileOnly)
                .map((item) => (
                  <li key={item.href}>
                    <NavLink item={item} active={isActive(item.href)} />
                  </li>
                ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  );
}
