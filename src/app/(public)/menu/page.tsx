import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { menuCategoriesQuery, menuItemsByCategoryQuery } from "@/sanity/lib/queries";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { MenuItemCard } from "@/components/menu/MenuItemCard";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Menu | Make No Sense",
  description:
    "Bold burgers, seasoned fries, and scratch-made sauces. Browse the full Make No Sense food truck menu — Nashville's favorite.",
  openGraph: {
    title: "Menu | Make No Sense",
    description:
      "Bold burgers, seasoned fries, and scratch-made sauces. Browse the full Make No Sense food truck menu — Nashville's favorite.",
    type: "website",
    url: "https://makenosense.info/menu",
    siteName: "Make No Sense",
  },
  twitter: {
    card: "summary_large_image",
    title: "Menu | Make No Sense",
    description:
      "Bold burgers, seasoned fries, and scratch-made sauces. Browse the full Make No Sense food truck menu — Nashville's favorite.",
  },
};

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    client.fetch(menuCategoriesQuery),
    client.fetch(menuItemsByCategoryQuery),
  ]);

  const hasContent = categories.length > 0 && items.length > 0;

  return (
    <div className="bg-char-black min-h-screen w-full">
      {/* Page heading */}
      <div className="bg-mid-gray py-10 sm:py-16 px-5 sm:px-6 lg:px-8 text-center">
        <h1
          className="uppercase font-bold text-off-white text-5xl sm:text-7xl lg:text-8xl tracking-tight"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Our Menu
        </h1>
        <div className="mx-auto mt-4 h-1 w-16 bg-truck-red rounded" />
        <p className="mt-5 text-light-gray text-base max-w-md mx-auto">
          Made fresh, served bold. Everything on this truck is made to be remembered.
        </p>
      </div>

      {/* Sticky category filter — only show categories that have items */}
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories.filter((cat: any) =>
            items.some((item: any) => item.categoryId === cat._id)
          )}
        />
      )}

      {/* Menu sections */}
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-10 sm:gap-16">
        {!hasContent && (
          <div className="py-24 text-center">
            <p className="font-display text-off-white/30 text-2xl">
              Menu coming soon
            </p>
          </div>
        )}

        {categories.map((category: any) => {
          const categoryItems = items.filter(
            (item: any) => item.categoryId === category._id
          );

          if (categoryItems.length === 0) return null;

          return (
            <section key={category._id} id={category.slug} className="scroll-mt-32">
              {/* Category label */}
              <div className="flex items-center gap-4 mb-5 sm:mb-8">
                <h2 className="font-display uppercase text-off-white text-2xl sm:text-4xl tracking-tight">
                  {category.name}
                </h2>
                <div className="flex-1 h-px bg-off-white/15" />
                <span className="font-display text-xs text-light-gray">
                  {categoryItems.length} item{categoryItems.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                {categoryItems.map((item: any, idx: number) => (
                  <MenuItemCard key={item._id} item={item} priority={idx === 0} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Combo note */}
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pb-4">
        <div className="h-px bg-off-white/15 mb-4" />
        <p className="text-center font-sans text-sm" style={{ color: '#FAF7F2' }}>
          All entrees available as a combo, add a side and drink
        </p>
      </div>
    </div>
  );
}
