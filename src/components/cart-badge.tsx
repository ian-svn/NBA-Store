"use client";

import { useCart } from "@/context/cart-context";

export function CartBadge() {
  const { totalQuantity } = useCart();
  if (totalQuantity === 0) return null;
  return (
    <span className="absolute -right-3 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-semibold text-white">
      {totalQuantity > 99 ? "99+" : totalQuantity}
    </span>
  );
}
