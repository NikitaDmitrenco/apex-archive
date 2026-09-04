"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { useState } from "react";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/typography";
import {
  ARCHIVE_GROUP_LABEL,
  archiveNav,
  utilityNav,
} from "@/lib/constants/navigation";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open menu"
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-9 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none md:hidden"
      >
        <Menu className="size-5" />
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Radix puts the background scroll lock on the overlay, so it has to render. */}
        <Dialog.Overlay className="bg-background fixed inset-0 z-50" />
        <Dialog.Content
          aria-describedby={undefined}
          className="bg-background fixed inset-0 z-50 flex flex-col overflow-y-auto"
        >
          <Dialog.Title className="sr-only">Site navigation</Dialog.Title>

          <Container>
            <div className="flex h-16 items-center justify-between">
              <Link
                href="/"
                onClick={close}
                className="text-sm font-medium tracking-[0.28em] uppercase"
              >
                Apex
              </Link>
              <Dialog.Close
                aria-label="Close menu"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex size-9 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>
          </Container>

          <Container className="flex flex-1 flex-col justify-center pb-16">
            <nav aria-label="Primary">
              <Eyebrow>{ARCHIVE_GROUP_LABEL}</Eyebrow>
              <ul className="mt-6 space-y-1">
                {archiveNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="font-display hover:text-primary block py-2 text-4xl font-light tracking-[-0.02em] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <hr className="border-border my-10" />

              <ul className="space-y-1">
                {utilityNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="text-muted-foreground hover:text-foreground block py-2 font-mono text-sm tracking-[0.16em] uppercase transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
