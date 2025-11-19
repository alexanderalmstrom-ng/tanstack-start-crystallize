import { Link } from "@tanstack/react-router";
import Picture from "./Picture/Picture";

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
  loading = "lazy",
}: ProductCardProps) {
  return (
    <Link
      className="flex flex-col"
      to={`/product/$slug`}
      params={{ slug: productHandle }}
    >
      {productImageUrl && (
        <Picture
          src={productImageUrl}
          alt={productImageAltText ?? productName}
          loading={loading}
          imageSizes={[320, 640, "50vw"]}
        />
      )}
      <div className="flex flex-col gap-1 px-2 py-1">
        <h3>{productName}</h3>
      </div>
    </Link>
  );
}
