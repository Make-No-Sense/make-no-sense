import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { galleryImagesQuery } from "@/sanity/lib/queries";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery | Make No Sense",
  description:
    "Photos from the Make No Sense food truck — the food, the truck, and the Nashville community that makes it worth it.",
  openGraph: {
    title: "Gallery | Make No Sense",
    description:
      "Photos from the Make No Sense food truck — the food, the truck, and the Nashville community that makes it worth it.",
    type: "website",
    url: "https://makenosense.info/gallery",
    siteName: "Make No Sense",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery | Make No Sense",
    description:
      "Photos from the Make No Sense food truck — the food, the truck, and the Nashville community that makes it worth it.",
  },
};

export default async function GalleryPage() {
  const images = await client.fetch(galleryImagesQuery);

  return (
    <div className="bg-char-black min-h-screen w-full">
      {/* Page header */}
      <div className="bg-mid-gray py-16 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display uppercase text-off-white text-5xl sm:text-6xl tracking-tight">
          Gallery
        </h1>
        <div className="mx-auto mt-4 h-1 w-16 bg-truck-red rounded" />
        <p className="mt-5 text-light-gray text-base">
          From the truck to the table.
        </p>
      </div>

      <GalleryGrid images={images ?? []} />
    </div>
  );
}
