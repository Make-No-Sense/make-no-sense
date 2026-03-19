import { client } from "@/sanity/lib/client";
import { menuCategoriesQuery, menuItemsByCategoryQuery } from "@/sanity/lib/queries";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { MenuItemCard } from "@/components/menu/MenuItemCard";

export const revalidate = 60;

export const metadata = {
  title: "Menu | Make No Sense",
  description: "Browse the full Make No Sense menu — bold flavors, Nashville-made.",
};

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    client.fetch(menuCategoriesQuery),
    client.fetch(menuItemsByCategoryQuery),
  ]);

  const hasContent = categories.length > 0 && items.length > 0;

  return (
    <div className="bg-warm-cream min-h-screen">
      {/* Page heading */}
      <div className="bg-deep-navy py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display font-bold uppercase text-warm-cream text-5xl sm:text-6xl tracking-tight">
          Our Menu
        </h1>
        <div className="mx-auto mt-4 h-1 w-16 bg-brick-red rounded" />
        <p className="mt-5 text-warm-cream/60 text-base max-w-md mx-auto">
          Made fresh, served bold. Everything on this truck is made to be remembered.
        </p>
      </div>

      {/* Sticky category filter */}
      {categories.length > 0 && (
        <CategoryFilter categories={categories} />
      )}

      {/* Menu sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-16">
        {!hasContent && (
          <div className="py-24 text-center">
            <p className="font-display uppercase text-deep-navy/30 text-2xl tracking-wider">
              Menu coming soon
            </p>
          </div>
        )}

        {categories.map((category) => {
          const categoryItems = items.filter(
            (item) => item.categoryId === category._id
          );

          if (categoryItems.length === 0) return null;

          return (
            <section key={category._id} id={category.slug} className="scroll-mt-32">
              {/* Category label */}
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-display font-bold uppercase text-deep-navy text-3xl sm:text-4xl tracking-tight">
                  {category.name}
                </h2>
                <div className="flex-1 h-px bg-deep-navy/15" />
                <span className="font-display text-xs uppercase tracking-widest text-slate">
                  {categoryItems.length} item{categoryItems.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoryItems.map((item) => (
                  <MenuItemCard key={item._id} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
