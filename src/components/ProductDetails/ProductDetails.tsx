import type { Product } from "@/gql/discovery/graphql";

export default function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="px-4 py-6 lg:p-10">
      <h1 className="text-2xl lg:text-4xl tracking-tight">{product.name}</h1>
    </div>
  );
}
