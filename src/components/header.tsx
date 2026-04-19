import Link from "next/link";

import { CartBadge } from "@/components/cart-badge";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a1628]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-bold tracking-tight text-white">
            Tienda NBA
          </span>
          <span className="hidden text-sm text-orange-400/90 sm:inline">
            Argentina
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/"
            className="text-zinc-300 transition hover:text-white"
          >
            Tienda
          </Link>
          <Link
            href="/carrito"
            className="relative flex items-center gap-1 text-zinc-300 transition hover:text-white"
          >
            Carrito
            <CartBadge />
          </Link>
        </nav>
      </div>
    </header>
  );
}
