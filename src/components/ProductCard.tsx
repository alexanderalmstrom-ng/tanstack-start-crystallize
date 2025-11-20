import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

type ProductCardProps = {
  productName: string;
  productImageUrl?: string;
  productImageAltText?: string | null;
  productHandle: string;
  productImageWidth?: number;
  productImageHeight?: number;
  loading?: "lazy" | "eager" | undefined;
};

export default function ProductCard({
  productName,
  productImageUrl,
  productImageAltText,
  productHandle,
  productImageWidth,
  productImageHeight,
  loading = "lazy",
}: ProductCardProps) {
  return (
    <Link
      className="flex flex-col"
      to={`/product/$slug`}
      params={{ slug: productHandle }}
    >
      {productImageUrl && (
        <picture className="bg-amber-50">
          <Image
            className="w-full h-full object-contain aspect-square mix-blend-multiply"
            src={productImageUrl}
            alt={productImageAltText ?? productName}
            width={productImageWidth ?? 1000}
            height={productImageHeight ?? 1000}
            sizes="(min-width: 1024px) 25vw, 50vw"
            priority={loading === "eager"}
          />
        </picture>
      )}
      <div className="flex flex-col gap-1 px-2 py-1">
        <h3>{productName}</h3>
      </div>
    </Link>
  );
}
