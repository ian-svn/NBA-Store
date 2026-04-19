"use client";

import { useState } from "react";

import { ProductImage } from "@/components/product-image";
import type { Product } from "@/sanity/lib/queries";

export function ProductGallery({ product }: { product: Product }) {
  const [index, setIndex] = useState(0);
  const images = product.images;
  const current = images[index] ?? images[0];
  const altBase =
    (current && "alt" in current && current.alt) || product.title;

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-white/5 text-zinc-500">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
        <ProductImage
          image={current}
          alt={altBase}
          width={800}
          height={800}
          className="h-auto w-full object-contain"
          priority
        />
      </div>
      {images.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <button
              key={img._key ?? i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition ${
                i === index
                  ? "border-orange-500"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <ProductImage
                image={img}
                alt={
                  ("alt" in img && img.alt) || `${product.title} ${i + 1}`
                }
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
