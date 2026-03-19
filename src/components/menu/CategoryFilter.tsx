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
    const stickyOffset = 64 + barHeight; // navbar (h-16) + filter bar
    const top = el.getBoundingClientRect().top + window.scrollY - stickyOffset - 16;
    window.scrollTo({ top, behavior: "smooth" });
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
              key={_id}
              onClick={() => scrollTo(slug)}
              className={`
                px-4 py-2 font-display text-xs uppercase tracking-wider rounded transition-colors whitespace-nowrap
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
