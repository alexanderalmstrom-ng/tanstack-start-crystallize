import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { getDiscoveryProducts } from "@/integrations/crystallize/discovery/getDiscoveryProducts";
import { removeLeadingSlash } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const products = await getDiscoveryProducts();

    return {
      products,
    };
  },
});

function App() {
  const { products } = Route.useLoaderData();

  return (
    <Fragment>
      <div>
        <h2 className="text-2xl font-bold">Products </h2>
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
