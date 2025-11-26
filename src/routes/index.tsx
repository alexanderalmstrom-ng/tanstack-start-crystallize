import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { getDiscoveryProductsServerFn } from "@/integrations/server/discovery/getDiscoveryProductsServerFn";
import { removeLeadingSlash } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const products = await getDiscoveryProductsServerFn();

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
                  to={`/$`}
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
