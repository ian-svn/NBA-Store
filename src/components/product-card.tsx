import Link from "next/link";

import { ProductImage } from "@/components/product-image";
import { formatArs } from "@/lib/currency";
import type { Product } from "@/sanity/lib/queries";

export function ProductCard({ product }: { product: Product }) {
  const main = product.images[0];
  const alt =
    (main && "alt" in main && main.alt) || product.title;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg transition hover:border-orange-500/40 hover:bg-white/[0.06]">
      <Link href={`/producto/${product.slug.current}`} className="relative block aspect-square overflow-hidden bg-black/40">
        {main ? (
          <ProductImage
            image={main}
            alt={alt}
            width={480}
            height={480}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : null}
        {product.inStock === false ? (
          <span className="absolute left-2 top-2 rounded bg-red-600/90 px-2 py-0.5 text-xs font-medium text-white">
            Sin stock
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/producto/${product.slug.current}`}>
          <h2 className="text-lg font-semibold text-white transition group-hover:text-orange-400">
            {product.title}
          </h2>
        </Link>
        <p className="text-lg font-medium text-orange-400">
          {formatArs(product.price)}
        </p>
      </div>
    </article>
  );
}
