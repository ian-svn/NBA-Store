import Link from "next/link";

export const metadata = { title: "Pago rechazado · Tienda NBA" };

export default function PagoErrorPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="mb-4 text-2xl font-bold text-white">El pago no se completó</h1>
      <p className="text-zinc-400">
        Podés intentar de nuevo desde el carrito o elegir otro medio de pago.
      </p>
      <Link
        href="/carrito"
        className="mt-8 inline-block rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
      >
        Ir al carrito
      </Link>
    </div>
  );
}
