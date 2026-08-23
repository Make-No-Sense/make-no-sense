"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";

const NAVY = "#0F1B35";
const CREAM = "#FAF6F0";
const RED = "#C41E1E";
const SLATE = "#6B7280";
const GOLD_MUTED = "#7A6435";
const MIN_ORDER = 25;

const PRODUCTS = [
  {
    id: "sig-sauce",
    name: "MNS Signature Sauce",
    price: 8.0,
    description: "Our legendary house sauce. The secret behind every burger.",
  },
  {
    id: "hot-honey",
    name: "MNS Hot Honey Sauce",
    price: 8.0,
    description: "Sweet heat in a bottle. Drizzle it on everything.",
  },
  {
    id: "fry-season",
    name: "MNS Fry Seasoning",
    price: 6.0,
    description: "The seasoning that makes our fries unforgettable. Now for your kitchen.",
  },
  {
    id: "punch-watermelon",
    name: "MNS Punch — Watermelon",
    price: 12.0,
    description: "Tropical Paradise On Ice. Watermelon edition.",
  },
  {
    id: "punch-mango",
    name: "MNS Punch — Mango",
    price: 12.0,
    description: "Tropical Paradise On Ice. Mango edition.",
  },
  {
    id: "punch-lemony-blue",
    name: "MNS Punch — Lemony Blue",
    price: 12.0,
    description: "Lemonade, coconut, and blue curacao. Famous MNS Punch.",
  },
];

interface CartItem {
  productId: string;
  quantity: number;
}

export function ShopClient() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  function addToCart(productId: string) {
    setCart((prev) => {
      const found = prev.find((i) => i.productId === productId);
      if (found)
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      return [...prev, { productId, quantity: 1 }];
    });
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(productId: string) {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }

  const totalItems = cart.reduce((n, i) => n + i.quantity, 0);
  const subtotal = cart.reduce((n, i) => {
    const p = PRODUCTS.find((p) => p.id === i.productId);
    return n + (p?.price ?? 0) * i.quantity;
  }, 0);
  const canCheckout = subtotal >= MIN_ORDER;

  return (
    <div style={{ backgroundColor: CREAM }}>
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <section
        className="py-14 sm:py-20 px-5 sm:px-6 lg:px-8 text-center"
        style={{ backgroundColor: NAVY }}
      >
        <p
          className="font-display uppercase tracking-[0.3em] text-sm mb-4"
          style={{ color: "#00AEEF" }}
        >
          Make No Sense
        </p>
        <h1
          className="uppercase font-bold tracking-tight text-5xl sm:text-7xl lg:text-8xl"
          style={{ color: "#F5F0E8", fontFamily: "var(--font-oswald)" }}
        >
          THE SHOP
        </h1>
        <div
          className="mx-auto mt-5 h-1 w-16 rounded"
          style={{ backgroundColor: RED }}
        />
        <p className="mt-5 text-lg" style={{ color: "#94A3B8" }}>
          Take the flavor home
        </p>
      </section>

      {/* ── Floating cart button ──────────────────────────────────────── */}
      <button
        type="button"
        className="fixed z-40 flex items-center justify-center rounded-full shadow-lg"
        style={{
          top: "80px",
          right: "16px",
          width: "52px",
          height: "52px",
          backgroundColor: NAVY,
        }}
        onClick={() => setCartOpen(true)}
        aria-label="Open cart"
      >
        <ShoppingCart size={22} color={CREAM} />
        {totalItems > 0 && (
          <span
            className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
            style={{
              backgroundColor: RED,
              color: CREAM,
              transform: "translate(35%, -35%)",
            }}
          >
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
      </button>

      {/* ── Product Grid ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="rounded-xl overflow-hidden flex flex-col"
              style={{
                backgroundColor: CREAM,
                border: "1px solid #DDD5C8",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              }}
            >
              {/* MNS placeholder image area */}
              <div
                className="flex items-center justify-center"
                style={{ height: "220px", backgroundColor: NAVY }}
              >
                <span
                  className="font-display text-6xl font-bold tracking-widest select-none"
                  style={{ color: GOLD_MUTED, opacity: 0.55 }}
                >
                  MNS
                </span>
              </div>

              {/* Card body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 gap-2">
                <h3
                  className="font-bold leading-tight text-lg sm:text-xl"
                  style={{ color: NAVY, fontFamily: "var(--font-oswald)" }}
                >
                  {product.name}
                </h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: SLATE }}>
                  {product.description}
                </p>
                <p
                  className="text-lg font-bold mt-1"
                  style={{ color: RED, fontFamily: "'Courier New', monospace" }}
                >
                  ${product.price.toFixed(2)}
                </p>
                <button
                  type="button"
                  onClick={() => addToCart(product.id)}
                  className="mt-2 py-3 font-display text-sm font-semibold rounded transition-opacity hover:opacity-80"
                  style={{ backgroundColor: NAVY, color: CREAM }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cart Drawer ───────────────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className="relative flex flex-col w-full max-w-sm h-full shadow-2xl"
            style={{ backgroundColor: CREAM }}
          >
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{
                backgroundColor: NAVY,
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} color={CREAM} />
                <span
                  className="font-display text-sm font-semibold"
                  style={{ color: CREAM }}
                >
                  Your Cart
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="p-1 rounded"
                aria-label="Close cart"
                style={{ color: CREAM }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <ShoppingCart size={40} color={SLATE} opacity={0.35} />
                  <p
                    className="font-display text-sm"
                    style={{ color: SLATE }}
                  >
                    Your cart is empty
                  </p>
                  <button
                    type="button"
                    onClick={() => setCartOpen(false)}
                    className="mt-2 px-5 py-2 rounded font-display text-sm"
                    style={{ backgroundColor: NAVY, color: CREAM }}
                  >
                    Keep Shopping
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col">
                  {cart.map((item) => {
                    const product = PRODUCTS.find((p) => p.id === item.productId)!;
                    return (
                      <li
                        key={item.productId}
                        className="py-4 flex items-start gap-3"
                        style={{ borderBottom: "1px solid #DDD5C8" }}
                      >
                        {/* Name + line price */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-bold leading-snug text-sm"
                            style={{
                              color: NAVY,
                              fontFamily: "var(--font-oswald)",
                            }}
                          >
                            {product.name}
                          </p>
                          <p
                            className="text-xs mt-0.5 font-mono font-semibold"
                            style={{ color: RED }}
                          >
                            ${(product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Qty controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, -1)}
                            className="flex items-center justify-center w-7 h-7 rounded border"
                            style={{ borderColor: "#C8BDB0", color: NAVY }}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span
                            className="w-6 text-center text-sm font-bold tabular-nums"
                            style={{ color: NAVY }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, 1)}
                            className="flex items-center justify-center w-7 h-7 rounded border"
                            style={{ borderColor: "#C8BDB0", color: NAVY }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="ml-1 flex items-center justify-center w-7 h-7 rounded"
                            style={{ color: SLATE }}
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Drawer footer */}
            {cart.length > 0 && (
              <div
                className="px-5 py-5 flex flex-col gap-3 shrink-0"
                style={{
                  backgroundColor: "#EDE8E1",
                  borderTop: "1px solid #DDD5C8",
                }}
              >
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span
                    className="font-display text-sm font-semibold"
                    style={{ color: NAVY }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="font-mono font-bold text-base"
                    style={{ color: NAVY }}
                  >
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Minimum order notice */}
                {!canCheckout && (
                  <p
                    className="text-xs text-center rounded py-2 px-3"
                    style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}
                  >
                    $25.00 minimum order — add ${(MIN_ORDER - subtotal).toFixed(2)}{" "}
                    more to checkout
                  </p>
                )}

                {/* Checkout CTA */}
                {canCheckout ? (
                  <Link
                    href="/shop/checkout"
                    className="block text-center py-4 font-display uppercase tracking-widest text-sm font-semibold rounded"
                    style={{ backgroundColor: RED, color: CREAM }}
                  >
                    PROCEED TO CHECKOUT
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="py-4 font-display uppercase tracking-widest text-sm font-semibold rounded cursor-not-allowed"
                    style={{ backgroundColor: "#C8BDB0", color: "#8A7A6A" }}
                  >
                    Minimum Order $25.00
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
