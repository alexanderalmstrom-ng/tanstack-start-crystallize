import { Link } from "@tanstack/react-router";

type ProductCardProps = {
  productName: string;
  productImageUrl?: string;
  productImageAltText?: string | null;
  productHandle: string;
  productImageWidth?: number;
  productImageHeight?: number;
};

export default function ProductCard({
  productName,
  productImageUrl,
  productImageAltText,
  productHandle,
  productImageWidth,
  productImageHeight,
}: ProductCardProps) {
  return (
    <Link
      className="bg-amber-50/30"
      to={`/product/$slug`}
      params={{ slug: productHandle }}
    >
      {productImageUrl && (
        <img
          className="w-full h-full object-contain aspect-square mix-blend-multiply"
          src={productImageUrl}
          alt={productImageAltText ?? productName}
          loading="eager"
          width={productImageWidth}
          height={productImageHeight}
        />
      )}
      <h3>{productName}</h3>
    </Link>
  );
}
