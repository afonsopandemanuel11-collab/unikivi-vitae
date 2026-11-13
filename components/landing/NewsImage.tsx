"use client";

import { useState } from "react";
import Image from "next/image";

type NewsImageProps = {
  src: string;
  fallbackSrc: string;
  alt: string;
  className: string;
};

export default function NewsImage({ src, fallbackSrc, alt, className }: NewsImageProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <Image
      src={hasImageError ? fallbackSrc : src}
      alt={alt}
      width={800}
      height={450}
      unoptimized
      className={className}
      onError={() => {
        if (!hasImageError && src !== fallbackSrc) setHasImageError(true);
      }}
    />
  );
}
