"use client";

import Link from "next/link";

import { useCart } from "@/context/cart-context";
import { formatArs } from "@/lib/currency";
import { ProductImage } from "@/components/product-image";

export function CartLines() {
  const { lines, setQuantity, removeLine } = useCart();

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-zinc-400">Tu carrito está vacío.</p>
        <Link
          href="/"
          className="mt-4 inline-block text-orange-400 hover:text-orange-300"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {lines.map((line) => {
        const main = line.product.images[0];
        const alt =
          (main && "alt" in main && main.alt) || line.product.title;
        return (
          <li
            key={line.product._id}
            className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-black/40">
              {main ? (
                <ProductImage
                  image={main}
                  alt={alt}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/producto/${line.product.slug.current}`}
                    className="font-semibold text-white hover:text-orange-400"
                  >
                    {line.product.title}
                  </Link>
                  <p className="text-sm text-orange-400/90">
                    {formatArs(line.product.price)} c/u
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeLine(line.product._id)}
                  className="text-sm text-zinc-500 underline hover:text-red-400"
                >
                  Quitar
                </button>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-zinc-500">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  value={line.quantity}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    if (!Number.isFinite(n)) return;
                    setQuantity(line.product._id, n);
                  }}
                  className="w-20 rounded-lg border border-white/15 bg-black/40 px-2 py-1 text-white"
                />
                <span className="text-sm text-zinc-400">
                  Subtotal:{" "}
                  <span className="text-white">
                    {formatArs(line.product.price * line.quantity)}
                  </span>
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
