"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, isBooking }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 sm:p-10">
        <p className="font-display uppercase text-blue-800 text-2xl tracking-tight mb-3">
          Message Sent!
        </p>
        <p className="text-blue-700 text-base leading-relaxed">
          Thanks for reaching out — we&rsquo;ll get back to you as soon as we can.
          {isBooking && (
            <> Booking inquiries typically get a response within 24&ndash;48 hours.</>
          )}
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-[#d0c9bc] rounded px-4 py-3 text-char-black text-sm font-sans placeholder:text-[#b0a898] focus:outline-none focus:border-truck-red transition-colors";

  const labelClass = "block font-display uppercase text-char-black text-xs tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="cf-name" className={labelClass}>
          Name <span className="text-truck-red">*</span>
        </label>
        <input
          id="cf-name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="cf-email" className={labelClass}>
          Email <span className="text-truck-red">*</span>
        </label>
        <input
          id="cf-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="cf-phone" className={labelClass}>
          Phone <span className="text-light-gray font-sans normal-case tracking-normal text-xs">(optional)</span>
        </label>
        <input
          id="cf-phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="615-000-0000"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="cf-message" className={labelClass}>
          Message <span className="text-truck-red">*</span>
        </label>
        <textarea
          id="cf-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's on your mind?"
          className={`${inputClass} resize-none`}
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={isBooking}
          onChange={(e) => setIsBooking(e.target.checked)}
          className="mt-0.5 w-4 h-4 shrink-0 accent-truck-red cursor-pointer"
        />
        <span className="font-sans text-sm text-char-black leading-snug group-hover:text-mid-gray transition-colors">
          This is a booking inquiry
        </span>
      </label>

      {status === "error" && (
        <p className="text-truck-red text-sm font-sans">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-truck-red text-off-white font-display uppercase tracking-wider text-sm py-4 rounded hover:bg-flame-orange transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
