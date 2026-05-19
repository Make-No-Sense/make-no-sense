import type { Metadata, Viewport } from "next";
import { Fredoka, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const fredoka = Fredoka({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://makenosense.info"),
  title: {
    default: "Make No Sense | Nashville Food Truck",
    template: "%s | Make No Sense",
  },
  description:
    "Nashville's boldest food truck. Bold burgers, fresh fries, and scratch-made flavors. Find out where we're parked next.",
  openGraph: {
    type: "website",
    siteName: "Make No Sense",
    title: "Make No Sense | Nashville Food Truck",
    description:
      "Nashville's boldest food truck. Bold burgers, fresh fries, and scratch-made flavors. Find out where we're parked next.",
    url: "https://makenosense.info",
  },
  twitter: {
    card: "summary_large_image",
    title: "Make No Sense | Nashville Food Truck",
    description:
      "Nashville's boldest food truck. Bold burgers, fresh fries, and scratch-made flavors. Find out where we're parked next.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${dmSans.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col bg-char-black font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
