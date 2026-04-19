import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_QUERY, type Product } from "@/sanity/lib/queries";

/** Evita fallar el build si Sanity aún no está enlazado o el dataset no existe. */
export const dynamic = "force-dynamic";

export default async function Home() {
  if (!client) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-bold text-white">
          Bienvenido a Tienda NBA
        </h1>
        <p className="mb-6 text-zinc-400">
          Para mostrar productos desde Sanity, creá{" "}
          <code className="rounded bg-white/10 px-1 text-orange-400">
            .env.local
          </code>{" "}
          en la carpeta del proyecto con:
        </p>
        <pre className="overflow-x-auto rounded-xl bg-black/50 p-4 text-left text-sm text-zinc-300">
          {`NEXT_PUBLIC_SANITY_PROJECT_ID=tu_id
NEXT_PUBLIC_SANITY_DATASET=production`}
        </pre>
        <p className="mt-6 text-sm text-zinc-500">
          Luego ejecutá{" "}
          <code className="text-orange-400/90">npm run dev</code> y abrí{" "}
          <Link href="/studio" className="text-orange-400 underline">
            /studio
          </Link>{" "}
          para cargar productos e imágenes.
        </p>
      </div>
    );
  }

  let products: Product[] = [];
  try {
    products = await client.fetch<Product[]>(PRODUCTS_QUERY);
  } catch {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-bold text-white">
          No se pudo conectar a Sanity
        </h1>
        <p className="text-zinc-400">
          Revisá <code className="text-orange-400">NEXT_PUBLIC_SANITY_PROJECT_ID</code>,{" "}
          el dataset y que el proyecto esté activo en sanity.io.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="mb-4 text-2xl font-bold text-white">Tienda NBA</h1>
        <p className="text-zinc-400">
          Aún no hay productos publicados. Entrá al{" "}
          <Link href="/studio" className="text-orange-400 underline">
            panel Sanity
          </Link>{" "}
          y creá tu primer producto con fotos.
        </p>
      </div>
    );
  }

  const featuredProducts = products.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-12 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 md:p-10">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-orange-400/90">
          Temporada 2026
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
          Equipate como un verdadero fan de la NBA
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Explorá camisetas, zapatillas y accesorios oficiales cargados desde
          Sanity. Sumá productos al carrito y pagá en minutos con Mercado Pago.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="#productos"
            className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-[#0a1628] transition hover:bg-orange-400"
          >
            Ver productos
          </Link>
          <Link
            href="/carrito"
            className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ir al carrito
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-2xl font-bold text-white">{products.length}</p>
            <p className="text-sm text-zinc-400">productos publicados</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-2xl font-bold text-white">100%</p>
            <p className="text-sm text-zinc-400">editable desde Sanity</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-2xl font-bold text-white">MP</p>
            <p className="text-sm text-zinc-400">checkout con Mercado Pago</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white md:text-2xl">
            Destacados de la semana
          </h2>
          <Link
            href="#productos"
            className="text-sm text-orange-400 hover:text-orange-300"
          >
            Ver todo
          </Link>
        </div>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <li key={product._id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      <section id="productos">
        <h2 className="mb-5 text-xl font-semibold text-white md:text-2xl">
          Catálogo completo
        </h2>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product._id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
