"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

type MobileMenuProps = {
  links: ReadonlyArray<NavLink>;
};

export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center",
          "text-ink",
          "transition-opacity duration-[var(--dur-base)] [transition-timing-function:var(--ease-quart)]",
          "hover:opacity-60",
        )}
      >
        <svg
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        >
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="15" y2="15" />
        </svg>
      </button>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        className={cn(
          "fixed inset-0 z-50",
          "bg-paper",
          "transition-opacity duration-[var(--dur-base)] [transition-timing-function:var(--ease-quart)]",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-line">
            <div className="flex items-center justify-between h-20 px-[var(--side-pad)]">
              <Link
                href="/"
                aria-label="SSI — Accueil"
                onClick={() => setOpen(false)}
                className="inline-flex items-center"
              >
                <Image
                  src="/logo.png"
                  alt="SSI"
                  width={104}
                  height={50}
                  sizes="104px"
                  className="block"
                />
              </Link>

              <button
                type="button"
                aria-label="Fermer le menu"
                onClick={() => setOpen(false)}
                className={cn(
                  "inline-flex h-10 w-10 items-center justify-center",
                  "text-ink",
                  "transition-opacity duration-[var(--dur-base)]",
                  "hover:opacity-60",
                )}
              >
                <svg
                  aria-hidden="true"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                >
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <nav
            aria-label="Menu mobile"
            className="flex-1 px-[var(--side-pad)] pt-[var(--space-5)] pb-[var(--space-6)] overflow-y-auto"
          >
            <ul className="flex flex-col gap-[var(--space-3)]">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block text-ink font-medium",
                      "text-[length:var(--text-h2)] leading-[1.15] tracking-[-0.02em]",
                      "transition-opacity duration-[var(--dur-base)]",
                      "hover:opacity-60",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
