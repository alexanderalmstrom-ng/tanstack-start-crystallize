import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { useTRPC } from "@/integrations/trpc/react";
import { removeLeadingSlash } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: App,
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.crystallize.products.queryOptions(),
    );
  },
});

function App() {
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.crystallize.catalogueSubtreeByPath.queryOptions({ path: "/" }),
  );

  return (
    <Fragment>
      <div>
        {data?.data?.catalogue?.subtree?.edges?.map((edge) => {
          if (!edge.node.path) {
            return null;
          }

          return (
            <Link
              key={edge.node.id}
              to={`/$`}
              params={{ _splat: removeLeadingSlash(edge.node.path) }}
            >
              <h2>{edge.node.name}</h2>
            </Link>
          );
        })}
      </div>
    </Fragment>
  );
}
