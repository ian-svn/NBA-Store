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
          Mercado Pago acredita en la cuenta del{" "}
          <strong className="text-zinc-400">Access Token</strong> que configures
          en el servidor. Para recibir en el alias{" "}
          <strong className="text-zinc-400">ianvilap</strong>, usá un token de{" "}
          esa misma cuenta de Mercado Pago (
          <a
            href="https://www.mercadopago.com.ar/developers/panel/credentials"
            className="text-orange-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            credenciales
          </a>
          ).
        </p>
        <p className="mt-3 text-xs text-zinc-600">
          Variable opcional:{" "}
          <code className="text-zinc-500">NEXT_PUBLIC_APP_URL</code> (ej.{" "}
          <code className="text-zinc-500">http://localhost:3000</code>) para
          URLs de retorno tras el pago.
        </p>
      </div>
    </div>
  );
}
