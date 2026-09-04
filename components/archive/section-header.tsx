import Link from "next/link";

import { Display, Eyebrow } from "@/components/ui/typography";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "View all",
}: SectionHeaderProps) {
  return (
    <div className="border-border flex flex-wrap items-end justify-between gap-6 border-b pb-6">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Display as="h2" size="sm" className="mt-4">
          {title}
        </Display>
      </div>
      {href ? (
        <Link
          href={href}
          className="text-muted-foreground hover:text-foreground font-mono text-[0.7rem] tracking-[0.16em] uppercase transition-colors"
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
