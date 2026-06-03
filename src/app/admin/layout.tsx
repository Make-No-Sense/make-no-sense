import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Make No Sense",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="contents">{children}</div>;
}
