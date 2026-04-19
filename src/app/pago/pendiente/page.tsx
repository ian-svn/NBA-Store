import Link from "next/link";

export const metadata = { title: "Pago pendiente · Tienda NBA" };

export default function PagoPendientePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="mb-4 text-2xl font-bold text-white">Pago pendiente</h1>
      <p className="text-zinc-400">
        Tu pago está en proceso. Te avisaremos cuando se acredite (no cierres la
        app de Mercado Pago si te pidió completar el paso).
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-orange-400 hover:text-orange-300"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
