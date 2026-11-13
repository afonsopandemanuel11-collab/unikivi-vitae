"use client";

import { useState } from "react";

type NewsImageProps = {
  src: string;
  fallbackSrc: string;
  alt: string;
  className: string;
};

export default function NewsImage({ src, fallbackSrc, alt, className }: NewsImageProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <img
      src={hasImageError ? fallbackSrc : src}
      alt={alt}
      className={className}
      onError={() => {
        if (!hasImageError && src !== fallbackSrc) setHasImageError(true);
      }}
    />
  );
}
