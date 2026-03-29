import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface MenuItem {
  _id: string;
  name: string;
  description: string | null;
  price: number | null;
  badge: string | null;
  image: { asset: { _ref: string } | null; alt: string | null } | null;
}

const BADGE_STYLES: Record<string, string> = {
  New: "bg-brick-red text-white",
  "Fan Favorite": "bg-muted-gold text-navy-black",
  Limited: "bg-deep-navy text-warm-cream",
};

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="bg-pale-blue rounded-lg overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-deep-navy/10">
        {item.image?.asset?._ref ? (
          <Image
            src={urlFor(item.image).width(500).height(350).url()}
            alt={item.image.alt ?? item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-deep-navy/20 text-4xl sm:text-5xl uppercase tracking-widest">
              MNS
            </span>
          </div>
        )}

        {item.badge && (
          <span
            className={`absolute top-3 left-3 px-2 py-1 font-display text-xs uppercase tracking-wider rounded ${BADGE_STYLES[item.badge] ?? "bg-slate text-white"}`}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-semibold uppercase text-deep-navy text-base leading-tight">
            {item.name}
          </h3>
          {item.price != null && item.price > 0 && (
            <span className="font-mono text-muted-gold font-bold text-base shrink-0">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-slate text-sm leading-relaxed">{item.description}</p>
        )}
      </div>
    </div>
  );
}
