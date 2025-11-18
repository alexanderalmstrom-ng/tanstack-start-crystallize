import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import getProducts from "@/utils/getProducts";

const getProductsServerFn = createServerFn().handler(async () => {
  const products = await getProducts();
  return { products };
});

export const Route = createFileRoute("/product/$slug")({
  component: RouteComponent,
  loader: async () => {
    const { products } = await getProductsServerFn();
    return { products };
  },
});

function RouteComponent() {
  const { products } = Route.useLoaderData();

  return (
    <div>
      {products?.map((product) => (
        <div key={product.title}>
          <h1>{product.title}</h1>
        </div>
      ))}
    </div>
  );
}
