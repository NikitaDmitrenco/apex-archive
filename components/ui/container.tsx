import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[100rem] px-6 md:px-10 lg:px-16",
        className,
      )}
      {...props}
    />
  );
}

export function Section({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("py-section-sm md:py-section-md", className)}
      {...props}
    />
  );
}
