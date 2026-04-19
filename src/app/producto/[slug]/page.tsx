import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductGallery } from "@/components/product-gallery";
import { formatArs } from "@/lib/currency";
import { client } from "@/sanity/lib/client";
import {
  PRODUCT_BY_SLUG_QUERY,
  type Product,
} from "@/sanity/lib/queries";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  if (!client) return { title: "Producto · Tienda NBA" };
  const { slug } = await params;
  const product = await client.fetch<Product | null>(
    PRODUCT_BY_SLUG_QUERY,
    { slug }
  );
  if (!product)
    return { title: "No encontrado · Tienda NBA" };
  return {
    title: `${product.title} · Tienda NBA`,
    description: product.description ?? product.title,
  };
}

export default async function ProductoPage({ params }: PageProps) {
  if (!client) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center text-zinc-400">
        <p className="text-white">
          Configurá <code className="text-orange-400">NEXT_PUBLIC_SANITY_PROJECT_ID</code>{" "}
          en <code className="text-orange-400">.env.local</code>.
        </p>
      </div>
    );
  }

  const { slug } = await params;
  const product = await client.fetch<Product | null>(
    PRODUCT_BY_SLUG_QUERY,
    { slug }
  );

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-orange-400 hover:text-orange-300"
      >
        ← Volver a la tienda
      </Link>
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery product={product} />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {product.title}
          </h1>
          <p className="text-2xl font-semibold text-orange-400">
            {formatArs(product.price)}
          </p>
          {product.description ? (
            <p className="whitespace-pre-wrap text-zinc-300">{product.description}</p>
          ) : null}
          <div className="pt-2">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
