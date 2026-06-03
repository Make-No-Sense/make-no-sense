"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error ?? "Incorrect password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-admin-navy flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo + brand */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image
            src="/MNS_logo_3.jpg"
            alt="Make No Sense logo"
            width={72}
            height={72}
            className="rounded-full object-cover"
          />
          <h1 className="font-display text-2xl uppercase tracking-widest text-off-white">
            Make No Sense
          </h1>
          <p className="text-light-gray text-sm font-sans">Admin Portal</p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#243156] rounded-lg p-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-off-white/80 text-sm font-sans uppercase tracking-wide"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="bg-admin-navy border border-off-white/20 rounded px-4 py-3 text-off-white font-sans text-sm placeholder-light-gray focus:outline-none focus:border-truck-red transition-colors"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <p className="text-truck-red text-sm font-sans">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-truck-red hover:bg-flame-orange disabled:opacity-60 text-off-white font-display uppercase tracking-wider py-3 rounded transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
