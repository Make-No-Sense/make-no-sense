import Link from "next/link";
import Image from "next/image";
import { Leaf, Users, Star } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { aboutPageQuery } from "@/sanity/lib/queries";

export const metadata = {
  title: "About | Make No Sense",
  description:
    "Family-run. Nashville-made. No compromises. Learn the story behind Make No Sense food truck.",
};

const PILLARS = [
  {
    Icon: Leaf,
    title: "Sustainability",
    body: "We source locally whenever we can and keep our footprint small — from our ingredients to our packaging. Good food shouldn't cost the earth.",
  },
  {
    Icon: Users,
    title: "Community",
    body: "Nashville feeds us — in every sense. We show up for the city that showed up for us: neighborhood events, local festivals, and the regulars who keep us going.",
  },
  {
    Icon: Star,
    title: "Quality",
    body: "No shortcuts, no frozen shortcuts. Every burger is pressed, every fry is seasoned, and every sauce is made from scratch. If it's not right, it doesn't leave the window.",
  },
];

export default async function AboutPage() {
  const data = await client.fetch(aboutPageQuery);
  const truckImage = data?.truckImage;

  return (
    <div className="flex flex-col w-full">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-mid-gray py-24 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display uppercase text-off-white text-5xl sm:text-6xl lg:text-7xl tracking-tight">
          Our Story
        </h1>
        <div className="mx-auto mt-5 h-1 w-16 bg-truck-red rounded" />
        <p className="mt-6 text-light-gray text-lg max-w-md mx-auto">
          Family-run. Nashville-made. No compromises.
        </p>
      </section>

      {/* ── Brand intro ──────────────────────────────────────────────────── */}
      <section className="bg-char-black py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <blockquote className="font-display uppercase text-off-white text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
            "We don't just serve food. We serve an experience."
          </blockquote>
          <div className="mx-auto mt-6 h-1 w-12 bg-truck-red rounded" />

          <div className="mt-10 bg-mid-gray rounded-lg px-8 py-8 sm:px-12 sm:py-10 border-l-4 border-truck-red text-left">
            <p className="text-off-white text-lg leading-relaxed">
              <span className="font-display uppercase text-truck-red">
                Make No Sense
              </span>{" "}
              is a family-run food truck serving Nashville bold burgers, seasoned
              fries, and real flavors made from scratch.
            </p>
            <p className="mt-4 text-light-gray text-base leading-relaxed">
              We started with one belief: that great food doesn't need a building
              — just a truck, a passion, and a community worth feeding.
            </p>
          </div>
        </div>
      </section>

      {/* ── Value pillars ────────────────────────────────────────────────── */}
      <section className="bg-mid-gray py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="font-display text-truck-red uppercase tracking-[0.3em] text-sm mb-3">
              What We Stand For
            </p>
            <h2 className="font-display uppercase text-off-white text-4xl sm:text-5xl tracking-tight">
              Built Different
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PILLARS.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="bg-char-black rounded-lg p-8 flex flex-col gap-5"
              >
                <div className="w-12 h-12 rounded-full bg-mid-gray flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-amber-gold" />
                </div>
                <div>
                  <h3 className="font-display uppercase text-off-white text-xl tracking-tight mb-2">
                    {title}
                  </h3>
                  <p className="text-light-gray text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Truck ────────────────────────────────────────────────────── */}
      <section className="bg-char-black py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-truck-red uppercase tracking-[0.3em] text-sm mb-3">
            The Rig
          </p>
          <h2 className="font-display uppercase text-off-white text-4xl sm:text-5xl tracking-tight mb-6">
            The Truck
          </h2>
          <div className="mt-2 mb-10 bg-mid-gray rounded-lg px-8 py-8 sm:px-12 sm:py-10 border-l-4 border-truck-red text-left">
            <p className="text-off-white text-lg leading-relaxed">
              The black truck with red and yellow flames isn't just how we get
              around —{" "}
              <span className="font-display uppercase text-truck-red">
                it's who we are.
              </span>
            </p>
            <p className="mt-4 text-light-gray text-base leading-relaxed">
              Look for us at events, festivals, and locations across Nashville.
              When you see it pull up, you know something good is about to happen.
            </p>
          </div>

          <div className="aspect-[4/3] rounded-lg bg-mid-gray overflow-hidden relative">
            {truckImage?.asset ? (
              <Image
                src={urlFor(truckImage).width(900).height(675).fit("crop").url()}
                alt={truckImage.alt ?? "The Make No Sense food truck"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="font-display uppercase text-off-white/15 text-6xl sm:text-7xl tracking-widest select-none">
                  MNS
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-truck-red py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display uppercase text-off-white text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-10">
          Hungry?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-8 py-4 font-display uppercase tracking-wider text-sm border-2 border-off-white text-off-white hover:bg-off-white hover:text-truck-red transition-colors rounded"
          >
            See Our Menu
          </Link>
          <Link
            href="/find-us"
            className="inline-flex items-center justify-center px-8 py-4 font-display uppercase tracking-wider text-sm bg-off-white text-char-black hover:bg-off-white/90 transition-colors rounded"
          >
            Find the Truck
          </Link>
        </div>
      </section>
    </div>
  );
}
