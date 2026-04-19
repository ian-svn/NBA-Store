import type { SanityImageSource } from "@sanity/image-url";
import { groq } from "next-sanity";

export type SanityProductImage = SanityImageSource & {
  alt?: string;
  _key?: string;
};

export type Product = {
  _id: string;
  title: string;
  slug: { current: string };
  price: number;
  description?: string | null;
  images: SanityProductImage[];
  inStock?: boolean;
};

export const PRODUCTS_QUERY = groq`
  *[_type == "product" && defined(slug.current)] | order(_createdAt desc) {
    _id,
    title,
    slug,
    price,
    description,
    "images": images[defined(asset)],
    inStock
  }
`;

export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    price,
    description,
    "images": images[defined(asset)],
    inStock
  }
`;

export const PRODUCTS_BY_IDS_QUERY = groq`
  *[_type == "product" && _id in $ids] {
    _id,
    title,
    slug,
    price,
    description,
    "images": images[defined(asset)],
    inStock
  }
`;
