import { useQuery } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { useTRPC } from "@/integrations/trpc/react";
import { isMediaImage } from "@/lib/isMediaImage";
import ProductCard from "../../ProductCard/ProductCard";
import ProductCardContent from "../../ProductCard/ProductCardContent";
import ProductCardTitle from "../../ProductCard/ProductCardTitle";

export default function ProductList() {
  const trpc = useTRPC();
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery(trpc.shopify.products.queryOptions());

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products: {error?.message}</div>;
  }

  if (!products) {
    return <div>No products</div>;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px">
      {products.map((product, index) => {
        const mediaImage = product.media.nodes.filter(isMediaImage)[0];

        return (
          <ProductCard key={product.id} slug={product.handle}>
            <picture className="bg-secondary">
              <Image
                className="w-full h-full object-contain mix-blend-multiply aspect-square"
                src={mediaImage?.image?.url}
                alt={mediaImage?.image?.altText ?? product.title}
                width={mediaImage?.image?.width ?? 1000}
                height={mediaImage?.image?.height ?? 1000}
                sizes="(min-width: 1024px) 25vw, 50vw"
                priority={index < 4}
              />
            </picture>
            <ProductCardContent>
              <ProductCardTitle>{product.title}</ProductCardTitle>
            </ProductCardContent>
          </ProductCard>
        );
      })}
    </div>
  );
}
