import type { Metadata } from "next";
import { ShopClient } from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop | Make No Sense",
  description:
    "Take the MNS flavor home. Shop our signature sauces, seasonings, and punches.",
  openGraph: {
    title: "Shop | Make No Sense",
    description:
      "Take the MNS flavor home. Shop our signature sauces, seasonings, and punches.",
    type: "website",
    url: "https://makenosense.info/shop",
    siteName: "Make No Sense",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop | Make No Sense",
    description:
      "Take the MNS flavor home. Shop our signature sauces, seasonings, and punches.",
  },
};

export default function ShopPage() {
  return <ShopClient />;
}
