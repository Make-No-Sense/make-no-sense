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
  New: "bg-flame-orange text-off-white",
  "Fan Favorite": "bg-truck-red text-off-white",
  Limited: "bg-mid-gray text-off-white border border-off-white/20",
};

export function MenuItemCard({ item, priority }: { item: MenuItem; priority?: boolean }) {
  return (
    <div className="bg-mid-gray rounded-lg overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-video bg-char-black/40">
        {item.image?.asset?._ref ? (
          <Image
            src={urlFor(item.image).width(500).height(350).url()}
            alt={item.image.alt ?? item.name}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-off-white/20 text-4xl uppercase tracking-widest">
              MNS
            </span>
          </div>
        )}

        {item.badge && (
          <span
            className={`absolute top-3 left-3 px-2 py-1 font-display text-xs uppercase tracking-wider rounded ${BADGE_STYLES[item.badge] ?? "bg-light-gray text-off-white"}`}
          >
            {item.badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display uppercase text-off-white text-base leading-tight">
            {item.name}
          </h3>
          {item.price != null && item.price > 0 && (
            <span className="font-mono text-amber-gold font-bold text-base shrink-0">
              ${item.price.toFixed(2)}
            </span>
          )}
        </div>

        {item.description && (
          <p className="text-light-gray text-sm leading-relaxed">{item.description}</p>
        )}
      </div>
    </div>
  );
}
