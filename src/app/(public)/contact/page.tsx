import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Make No Sense",
  description:
    "Questions, booking inquiries, or just want to say hey? Reach out to Make No Sense food truck in Nashville.",
  openGraph: {
    title: "Contact | Make No Sense",
    description:
      "Questions, booking inquiries, or just want to say hey? Reach out to Make No Sense food truck in Nashville.",
    type: "website",
    url: "https://makenosense.info/contact",
    siteName: "Make No Sense",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Make No Sense",
    description:
      "Questions, booking inquiries, or just want to say hey? Reach out to Make No Sense food truck in Nashville.",
  },
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.52V6.74a4.85 4.85 0 0 1-1.02-.05z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "")
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return raw
}

export default async function ContactPage() {
  const settings = await client.fetch(siteSettingsQuery);

  const phone = settings?.phone ?? "615-663-3509";
  const email = settings?.email ?? "natoya@makenosense.info";

  const socials = [
    { key: "instagram", label: "Instagram", url: settings?.instagramUrl, Icon: InstagramIcon },
    { key: "tiktok", label: "TikTok", url: settings?.tiktokUrl, Icon: TikTokIcon },
    { key: "facebook", label: "Facebook", url: settings?.facebookUrl, Icon: FacebookIcon },
  ].filter((s) => s.url);

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display uppercase text-off-white text-5xl sm:text-6xl lg:text-7xl tracking-tight">
          Get In Touch
        </h1>
        <div className="mx-auto mt-5 h-1 w-20 bg-truck-red rounded" />
        <p className="mt-6 text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">
          Questions, booking inquiries, or just want to say hey? We&rsquo;d love to hear from you!
        </p>
      </section>

      {/* Two-column body */}
      <section className="bg-off-white py-16 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Left — Contact Info */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="font-display text-truck-red uppercase tracking-[0.3em] text-sm mb-3">
                  Reach Us
                </p>
                <h2 className="font-display uppercase text-char-black text-3xl sm:text-4xl tracking-tight">
                  Contact Info
                </h2>
              </div>

              <ul className="flex flex-col gap-5">
                <li>
                  <p className="font-display uppercase text-char-black text-xs tracking-wider mb-1">
                    Phone
                  </p>
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className="font-sans text-lg text-char-black hover:text-truck-red transition-colors"
                  >
                    {formatPhone(phone)}
                  </a>
                </li>
                <li>
                  <p className="font-display uppercase text-char-black text-xs tracking-wider mb-1">
                    Email
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="font-sans text-lg text-char-black hover:text-truck-red transition-colors break-all"
                  >
                    {email}
                  </a>
                </li>
              </ul>

              {socials.length > 0 && (
                <div>
                  <p className="font-display uppercase text-char-black text-xs tracking-wider mb-3">
                    Follow Us
                  </p>
                  <div className="flex items-center gap-4">
                    {socials.map(({ key, label, url, Icon }) => (
                      <a
                        key={key}
                        href={url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex items-center gap-2 text-char-black hover:text-truck-red transition-colors group"
                      >
                        <span className="p-2.5 rounded-full border border-[#d0c9bc] group-hover:border-truck-red/50 group-hover:bg-truck-red/5 transition-colors">
                          <Icon />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-amber-50 border-l-4 border-amber-400 px-5 py-4 rounded-r">
                <p className="font-sans text-sm text-amber-900 leading-relaxed">
                  For booking inquiries, please use the form and select{" "}
                  <span className="font-semibold">Booking Inquiry</span>.
                </p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-white rounded-lg shadow-sm border border-[#e8e0d5] p-8 sm:p-10">
              <p className="font-display text-truck-red uppercase tracking-[0.3em] text-sm mb-3">
                Send a Message
              </p>
              <h2 className="font-display uppercase text-char-black text-2xl tracking-tight mb-8">
                We&rsquo;ll Write Back
              </h2>
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
