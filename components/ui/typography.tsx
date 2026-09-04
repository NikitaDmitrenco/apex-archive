import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const displayVariants = cva(
  "font-display font-light tracking-[-0.02em] text-balance",
  {
    variants: {
      size: {
        hero: "text-hero leading-[0.9]",
        lg: "text-display-lg leading-[0.95]",
        md: "text-display-md leading-[1.02]",
        sm: "text-display-sm leading-[1.12]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type DisplayProps = ComponentProps<"h2"> &
  VariantProps<typeof displayVariants> & {
    as?: "h1" | "h2" | "h3" | "p";
  };

export function Display({
  as: Tag = "h2",
  size,
  className,
  ...props
}: DisplayProps) {
  return (
    <Tag className={cn(displayVariants({ size }), className)} {...props} />
  );
}

/** Small uppercase mono label — the technical caption style used across the archive. */
export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("spec-label text-muted-foreground", className)}
      {...props}
    />
  );
}

export function Lede({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-muted-foreground max-w-2xl text-lg leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
