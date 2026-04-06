"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/find-us", label: "Find Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-deep-navy sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="font-display text-xl font-bold uppercase tracking-widest text-warm-cream hover:text-muted-gold transition-colors"
          >
            Make No Sense
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-display text-sm uppercase tracking-wider text-warm-cream/80 hover:text-warm-cream transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/menu"
              className="bg-brick-red px-5 py-2 font-display text-sm font-semibold uppercase tracking-wider text-white hover:bg-brick-red/90 transition-colors rounded"
            >
              Order Now
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden text-warm-cream p-2 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu - OUTSIDE max-w-7xl container */}
      {open && (
        <div className="md:hidden bg-navy-black border-t border-white/10 w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-col py-4 gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="font-display text-sm uppercase tracking-wider text-warm-cream/80 hover:text-warm-cream py-3 px-2 border-b border-white/5 transition-colors min-h-[44px] flex items-center"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/menu"
                onClick={() => setOpen(false)}
                className="mt-3 bg-brick-red px-5 py-3 text-center font-display text-sm font-semibold uppercase tracking-wider text-white hover:bg-brick-red/90 transition-colors rounded min-h-[44px] flex items-center justify-center"
              >
                Order Now
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
