"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    <header className="bg-char-black sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 font-display text-xl uppercase tracking-widest text-truck-red hover:text-off-white transition-colors"
          >
            <Image
              src="/MNS_logo_3.jpg"
              alt="Make No Sense logo"
              width={42}
              height={42}
              className="rounded-full object-cover"
            />
            Make No Sense
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-display text-sm uppercase tracking-wider text-off-white/80 hover:text-off-white transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/menu"
              className="bg-truck-red px-5 py-2 font-display text-sm uppercase tracking-wider text-off-white hover:bg-flame-orange transition-colors rounded"
            >
              Order Now
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden text-off-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-mid-gray border-t border-off-white/10 w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-col py-4 gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="font-display text-sm uppercase tracking-wider text-off-white/80 hover:text-off-white py-3 px-2 border-b border-off-white/5 transition-colors min-h-[44px] flex items-center"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/menu"
                onClick={() => setOpen(false)}
                className="mt-3 bg-truck-red px-5 py-3 text-center font-display text-sm uppercase tracking-wider text-off-white hover:bg-flame-orange transition-colors rounded min-h-[44px] flex items-center justify-center"
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
