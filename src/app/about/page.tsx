import Link from "next/link";
import { Leaf, Users, Star } from "lucide-react";

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

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-deep-navy py-24 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display font-bold uppercase text-warm-cream text-5xl sm:text-6xl lg:text-7xl tracking-tight">
          Our Story
        </h1>
        <div className="mx-auto mt-5 h-1 w-16 bg-brick-red rounded" />
        <p className="mt-6 text-warm-cream/60 text-lg max-w-md mx-auto">
          Family-run. Nashville-made. No compromises.
        </p>
      </section>

      {/* ── Brand intro ──────────────────────────────────────────────────── */}
      <section className="bg-warm-cream py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <blockquote className="font-display font-bold uppercase text-deep-navy text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
            "We don't just serve food. We serve an experience."
          </blockquote>
          <div className="mx-auto mt-6 h-1 w-12 bg-brick-red rounded" />

          <div className="mt-10 bg-pale-blue rounded-lg px-8 py-8 sm:px-12 sm:py-10 border-l-4 border-brick-red text-left">
            <p className="text-soft-charcoal text-lg leading-relaxed">
              <span className="font-display font-semibold uppercase text-deep-navy">
                Make No Sense
              </span>{" "}
              is a family-run food truck serving Nashville bold burgers, seasoned
              fries, and real flavors made from scratch.
            </p>
            <p className="mt-4 text-slate text-base leading-relaxed">
              We started with one belief: that great food doesn't need a building
              — just a truck, a passion, and a community worth feeding.
            </p>
          </div>
        </div>
      </section>

      {/* ── Value pillars ────────────────────────────────────────────────── */}
      <section className="bg-deep-navy py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="font-display text-brick-red uppercase tracking-[0.3em] text-sm mb-3">
              What We Stand For
            </p>
            <h2 className="font-display font-bold uppercase text-warm-cream text-4xl sm:text-5xl tracking-tight">
              Built Different
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PILLARS.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="bg-pale-blue rounded-lg p-8 flex flex-col gap-5"
              >
                <div className="w-12 h-12 rounded-full bg-deep-navy flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-muted-gold" />
                </div>
                <div>
                  <h3 className="font-display font-bold uppercase text-deep-navy text-xl tracking-tight mb-2">
                    {title}
                  </h3>
                  <p className="text-slate text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Truck ────────────────────────────────────────────────────── */}
      <section className="bg-warm-cream py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-brick-red uppercase tracking-[0.3em] text-sm mb-3">
            The Rig
          </p>
          <h2 className="font-display font-bold uppercase text-deep-navy text-4xl sm:text-5xl tracking-tight mb-6">
            The Truck
          </h2>
          <div className="mt-2 mb-10 bg-pale-blue rounded-lg px-8 py-8 sm:px-12 sm:py-10 border-l-4 border-brick-red text-left">
            <p className="text-soft-charcoal text-lg leading-relaxed">
              The black truck with red and yellow flames isn't just how we get
              around —{" "}
              <span className="font-display font-semibold uppercase text-deep-navy">
                it's who we are.
              </span>
            </p>
            <p className="mt-4 text-slate text-base leading-relaxed">
              Look for us at events, festivals, and locations across Nashville.
              When you see it pull up, you know something good is about to happen.
            </p>
          </div>

          {/* Truck photo placeholder */}
          <div className="aspect-[4/3] rounded-lg bg-navy-black flex items-center justify-center overflow-hidden">
            <span className="font-display font-bold uppercase text-warm-cream/15 text-6xl sm:text-7xl tracking-widest select-none">
              MNS
            </span>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-brick-red py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display font-bold uppercase text-white text-5xl sm:text-6xl lg:text-7xl tracking-tight mb-10">
          Hungry?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center px-8 py-4 font-display font-semibold uppercase tracking-wider text-sm border-2 border-white text-white hover:bg-white hover:text-brick-red transition-colors rounded"
          >
            See Our Menu
          </Link>
          <Link
            href="/find-us"
            className="inline-flex items-center justify-center px-8 py-4 font-display font-semibold uppercase tracking-wider text-sm bg-white text-navy-black hover:bg-warm-cream transition-colors rounded"
          >
            Find the Truck
          </Link>
        </div>
      </section>
    </div>
  );
}
