import Link from "next/link";

import { CartLines } from "@/components/cart-lines";
import { CheckoutSection } from "@/components/checkout-section";

export const metadata = {
  title: "Carrito · Tienda NBA",
};

export default function CarritoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-white">Tu carrito</h1>
      <CartLines />
      <div className="mt-10 border-t border-white/10 pt-8">
        <CheckoutSection />
        <p className="mt-6 text-xs leading-relaxed text-zinc-500">
          Los pagos se procesan con Mercado Pago. Si algo falla, revisá las
          credenciales en el{" "}
          <a
            href="https://www.mercadopago.com.ar/developers/panel/credentials"
            className="text-orange-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            panel de desarrolladores
          </a>
          .
        </p>
        <p className="mt-3 text-xs text-zinc-600">
          Opcional:{" "}
          <code className="text-zinc-500">NEXT_PUBLIC_APP_URL</code> (por ejemplo{" "}
          <code className="text-zinc-500">http://localhost:3000</code>) para las
          URLs de retorno tras el pago.
        </p>
      </div>
    </div>
  );
}
