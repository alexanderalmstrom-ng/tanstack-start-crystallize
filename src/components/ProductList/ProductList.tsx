import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/integrations/trpc/react";
import { isMediaImage } from "@/utils/product";
import ProductCard from "../ProductCard";

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
          <ProductCard
            key={product.id}
            productName={product.title}
            productImageUrl={mediaImage?.image?.url}
            productImageAltText={mediaImage?.image?.altText}
            productHandle={product.handle}
            loading={index < 4 ? "eager" : undefined}
          />
        );
      })}
    </div>
  );
}
