"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Minus,
  Trash2,
  DollarSign,
  ClipboardList,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/ingredients", label: "Ingredients", icon: Package },
  { href: "/admin/stock", label: "Stock", icon: BarChart3 },
  { href: "/admin/log-usage", label: "Log Usage", icon: Minus },
  { href: "/admin/log-waste", label: "Log Waste", icon: Trash2 },
  { href: "/admin/expenses", label: "Expenses", icon: DollarSign },
  { href: "/admin/purchase-orders", label: "Purchase Orders", icon: ClipboardList },
];

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-sans text-sm transition-colors ${
        active
          ? "bg-truck-red text-off-white"
          : "text-off-white/70 hover:bg-white/10 hover:text-off-white"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-4 py-3 rounded-lg font-sans text-sm text-off-white/60 hover:bg-white/10 hover:text-off-white transition-colors w-full cursor-pointer"
    >
      <LogOut size={18} />
      Log Out
    </button>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-4 py-5 border-b border-white/10 hover:opacity-80 transition-opacity">
        <Image
          src="/MNS_logo_3.jpg"
          alt="Make No Sense logo"
          width={36}
          height={36}
          className="rounded-full object-cover flex-shrink-0"
        />
        <span className="font-display text-sm uppercase tracking-widest text-truck-red leading-tight">
          Make No Sense
        </span>
      </Link>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        {navLinks.map((link) => (
          <NavItem
            key={link.href}
            {...link}
            onClick={() => setMobileOpen(false)}
          />
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <LogoutButton />
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 bg-admin-navy flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* ── Mobile top bar ──────────────────────────────── */}
      <div className="md:hidden bg-admin-navy flex items-center justify-between px-4 h-14 sticky top-0 z-40 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image
            src="/MNS_logo_3.jpg"
            alt="Make No Sense logo"
            width={28}
            height={28}
            className="rounded-full object-cover"
          />
          <span className="font-display text-sm uppercase tracking-widest text-truck-red">
            Make No Sense
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="text-off-white p-2 cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile drawer ───────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative z-10 flex flex-col w-64 bg-admin-navy h-full">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
