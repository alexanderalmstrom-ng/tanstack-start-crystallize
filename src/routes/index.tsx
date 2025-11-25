import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { getDiscoveryProducts } from "@/integrations/crystallize/discovery/getDiscoveryProducts";
import { useTRPC } from "@/integrations/trpc/react";
import { removeLeadingSlash } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: App,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.catalogue.catalogueSubtreeByPath.queryOptions({ path: "/" }),
    );

    const products = await getDiscoveryProducts();

    return {
      products,
    };
  },
});

function App() {
  const { products } = Route.useLoaderData();
  const trpc = useTRPC();
  const { data: subtree } = useQuery(
    trpc.catalogue.catalogueSubtreeByPath.queryOptions({ path: "/" }),
  );

  return (
    <Fragment>
      <div>
        {products?.map(
          (product) => product && <div key={product.id}>{product.name}</div>,
        )}
      </div>
      <div>
        {subtree?.map((item) => {
          if (!item.path) {
            return null;
          }

          return (
            <Link
              key={item.id}
              to={`/$`}
              params={{ _splat: removeLeadingSlash(item.path) }}
            >
              <h2>{item.name}</h2>
            </Link>
          );
        })}
      </div>
    </Fragment>
  );
}
