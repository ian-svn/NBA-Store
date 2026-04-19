import Link from "next/link";

export const metadata = { title: "Pago exitoso · Tienda NBA" };

export default function PagoExitoPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="mb-4 text-2xl font-bold text-white">¡Pago aprobado!</h1>
      <p className="text-zinc-400">
        Gracias por tu compra. Recibirás la confirmación según Mercado Pago.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-xl bg-orange-500 px-6 py-3 font-semibold text-[#0a1628]"
      >
        Volver a la tienda
      </Link>
    </div>
  );
}
