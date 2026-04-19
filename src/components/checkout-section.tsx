"use client";

import { useState } from "react";

import { useCart } from "@/context/cart-context";
import { formatArs } from "@/lib/currency";

export function CheckoutSection() {
  const { lines, subtotal, clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (lines.length === 0) return null;

  const pay = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            _id: l.product._id,
            quantity: l.quantity,
          })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "No se pudo iniciar el pago.");
        return;
      }
      if (data.url) {
        clear();
        window.location.assign(data.url);
        return;
      }
      setError("Respuesta inválida del servidor.");
    } catch {
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-lg">
        <span className="text-zinc-400">Total</span>
        <span className="font-bold text-white">{formatArs(subtotal)}</span>
      </div>
      {error ? (
        <p className="mb-3 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={pay}
        disabled={loading}
        className="w-full rounded-xl bg-[#009ee3] px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-[#008ed0] disabled:opacity-60"
      >
        {loading ? "Redirigiendo…" : "Pagar con Mercado Pago"}
      </button>
    </div>
  );
}
