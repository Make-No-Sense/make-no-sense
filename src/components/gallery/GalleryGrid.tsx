"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

export interface GalleryImage {
  _id: string;
  image: { asset: { _ref: string } | null; alt: string | null } | null;
  caption: string | null;
  category: string | null;
  featured: boolean | null;
}

const TABS = ["All", "Food", "Truck", "Events"] as const;
type Tab = (typeof TABS)[number];

// ── Single image tile with per-image error boundary ──────────────────────────
function GalleryTile({
  image,
  onClick,
}: {
  image: GalleryImage;
  onClick: () => void;
}) {
  const [errored, setErrored] = useState(false);

  const src =
    !errored && image.image?.asset?._ref
      ? urlFor(image.image).width(800).height(800).fit("crop").url()
      : null;

  return (
    <button
      onClick={onClick}
      className="group relative aspect-square w-full overflow-hidden rounded-lg bg-pale-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brick-red"
      aria-label={image.image?.alt ?? image.caption ?? "Gallery image"}
    >
      {src ? (
        <Image
          src={src}
          alt={image.image?.alt ?? image.caption ?? "Gallery photo"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setErrored(true)}
        />
      ) : (
        // MNS placeholder — shown when no image asset or after load error
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-deep-navy/20 text-5xl uppercase tracking-widest">
            MNS
          </span>
        </div>
      )}

      {/* Category badge */}
      {image.category && (
        <span className="absolute top-3 right-3 px-2 py-1 font-display text-xs uppercase tracking-wider bg-deep-navy/80 text-warm-cream rounded backdrop-blur-sm">
          {image.category}
        </span>
      )}

      {/* Caption hover overlay */}
      {image.caption && (
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-navy-black/80 backdrop-blur-sm p-3">
          <p className="text-warm-cream text-sm leading-snug line-clamp-2">
            {image.caption}
          </p>
        </div>
      )}
    </button>
  );
}

// ── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  image,
  onClose,
}: {
  image: GalleryImage;
  onClose: () => void;
}) {
  const [errored, setErrored] = useState(false);

  const src =
    !errored && image.image?.asset?._ref
      ? urlFor(image.image).width(1600).url()
      : null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-black/95 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Inner panel — stop propagation so clicking image doesn't close */}
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-warm-cream/70 hover:text-warm-cream transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close lightbox"
        >
          <X size={28} />
        </button>

        {/* Image */}
        <div className="relative w-full flex-1 min-h-[50vh] max-h-[80vh] rounded-lg overflow-hidden bg-deep-navy/40">
          {src ? (
            <Image
              src={src}
              alt={image.image?.alt ?? image.caption ?? "Gallery photo"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              onError={() => setErrored(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-warm-cream/20 text-6xl uppercase tracking-widest">
                MNS
              </span>
            </div>
          )}
        </div>

        {/* Caption */}
        {image.caption && (
          <p className="mt-3 text-warm-cream/80 text-sm text-center leading-relaxed">
            {image.caption}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      {/* Camera icon */}
      <div className="mb-6 p-5 rounded-full bg-pale-blue">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-12 h-12 text-deep-navy/40"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
          />
        </svg>
      </div>
      <h2 className="font-display font-bold uppercase text-deep-navy text-3xl tracking-tight mb-3">
        Photos Coming Soon
      </h2>
      <p className="text-slate text-base max-w-sm mb-8 leading-relaxed">
        Check back soon — we're loading up the gallery.
      </p>
      <Link
        href="/menu"
        className="inline-flex items-center justify-center px-7 py-3 font-display font-semibold uppercase tracking-wider text-sm bg-brick-red text-white hover:bg-brick-red/90 transition-colors rounded"
      >
        See the Menu
      </Link>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const filtered =
    activeTab === "All"
      ? images
      : images.filter((img) => img.category === activeTab);

  return (
    <>
      {images.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Filter tabs */}
          <div className="sticky top-16 z-40 bg-warm-cream/95 backdrop-blur-sm border-b border-deep-navy/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex gap-1 py-3 overflow-x-auto">
                {TABS.map((tab) => {
                  const count =
                    tab === "All"
                      ? images.length
                      : images.filter((img) => img.category === tab).length;
                  if (tab !== "All" && count === 0) return null;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        flex items-center gap-1.5 px-4 py-2 font-display text-xs uppercase tracking-wider rounded transition-colors whitespace-nowrap
                        ${activeTab === tab ? "bg-deep-navy text-warm-cream" : "text-soft-charcoal hover:bg-pale-blue"}
                      `}
                    >
                      {tab}
                      <span
                        className={`text-[10px] ${activeTab === tab ? "text-warm-cream/60" : "text-slate"}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            {filtered.length === 0 ? (
              <p className="py-24 text-center font-display uppercase text-deep-navy/30 tracking-wider text-xl">
                No {activeTab.toLowerCase()} photos yet
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((image) => (
                  <GalleryTile
                    key={image._id}
                    image={image}
                    onClick={() => setLightboxImage(image)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}
    </>
  );
}
