"use client";

import { useEffect, useRef, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState<string>(categories[0]?.slug ?? "");
  const barRef = useRef<HTMLDivElement>(null);

  // Highlight the category whose section is nearest the top of the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    categories.forEach(({ slug }) => {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  function scrollTo(slug: string) {
    const el = document.getElementById(slug);
    if (!el) return;

    const barHeight = barRef.current?.offsetHeight ?? 0;
    const navHeight = 64; // h-16
    const totalSticky = navHeight + barHeight;

    // Get element position relative to document
    const elementTop = el.getBoundingClientRect().top + window.scrollY;

    // Calculate target scroll position - scroll to show section while keeping bar visible
    // Don't scroll past the sticky bar, just scroll enough to show the section title
    const targetScroll = elementTop - totalSticky - 8; // minimal margin below bar

    // Scroll to position
    window.scrollTo({
      top: targetScroll,
      behavior: "smooth"
    });

    setActive(slug);
  }

  return (
    <div
      ref={barRef}
      className="sticky top-16 z-40 bg-warm-cream/95 backdrop-blur-sm border-b border-deep-navy/10 overflow-x-auto"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1 py-3 min-w-max sm:min-w-0 sm:flex-wrap">
          {categories.map(({ _id, name, slug }) => (
            <button
              type="button"
              key={_id}
              onClick={() => scrollTo(slug)}
              className={`
                px-4 py-2 font-display text-sm uppercase tracking-wider rounded transition-colors whitespace-nowrap cursor-pointer
                ${
                  active === slug
                    ? "bg-deep-navy text-warm-cream"
                    : "text-soft-charcoal hover:bg-pale-blue"
                }
              `}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
