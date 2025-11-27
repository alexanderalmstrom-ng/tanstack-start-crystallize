import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { getProductsServerFn } from "@/lib/discovery/getProducts.server";
import { removeLeadingSlash } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const products = await getProductsServerFn();

    return {
      products,
    };
  },
  pendingComponent: () => <div>Loading...</div>,
});

function App() {
  const { products } = Route.useLoaderData();

  return (
    <Fragment>
      <div>
        <h2 className="text-2xl tracking-tight">Products</h2>
        {products?.map(
          (product) =>
            product && (
              <div key={product.id}>
                <Link
                  to={`/product/$`}
                  params={{ _splat: removeLeadingSlash(product.path ?? "/") }}
                >
                  {product.name}
                </Link>
              </div>
            ),
        )}
      </div>
    </Fragment>
  );
}
