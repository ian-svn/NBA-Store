import Image from "next/image";

import { urlFor } from "@/sanity/lib/image";
import type { SanityProductImage } from "@/sanity/lib/queries";

type Props = {
  image: SanityProductImage;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export function ProductImage({
  image,
  alt,
  width,
  height,
  className,
  priority,
}: Props) {
  const src = urlFor(image).width(width * 2).height(height * 2).quality(85).url();
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
