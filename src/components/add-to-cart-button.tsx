"use client";

import { useCart } from "@/context/cart-context";
import type { Product } from "@/sanity/lib/queries";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const disabled = product.inStock === false;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => addItem(product, 1)}
      className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-[#0a1628] shadow-lg transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {disabled ? "Sin stock" : "Agregar al carrito"}
    </button>
  );
}
