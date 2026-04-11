import Link from "next/link";

const quickLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/find-us", label: "Find Us" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="bg-mid-gray text-off-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <p className="font-display text-lg uppercase tracking-widest text-truck-red mb-3">
              Make No Sense
            </p>
            <p className="text-sm text-light-gray leading-relaxed">
              Nashville's boldest food truck. Unforgettable flavors, zero apologies.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="font-display text-xs uppercase tracking-widest text-amber-gold mb-4">
              Quick Links
            </p>
            <ul className="flex flex-col gap-2">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-light-gray hover:text-off-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-display text-xs uppercase tracking-widest text-amber-gold mb-4">
              Contact
            </p>
            <ul className="flex flex-col gap-2 text-sm text-light-gray">
              <li>
                <a
                  href="tel:6156633509"
                  className="hover:text-off-white transition-colors"
                >
                  615-663-3509
                </a>
              </li>
              <li>
                <a
                  href="mailto:natoya@makenosense.info"
                  className="hover:text-off-white transition-colors"
                >
                  natoya@makenosense.info
                </a>
              </li>
              <li className="pt-1">Nashville, TN</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-off-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-light-gray">
          <p>&copy; {new Date().getFullYear()} Make No Sense. All rights reserved.</p>
          <p>
            Built by{" "}
            <a
              href="https://makenosense.info"
              className="hover:text-off-white transition-colors"
            >
              makenosense.info
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
