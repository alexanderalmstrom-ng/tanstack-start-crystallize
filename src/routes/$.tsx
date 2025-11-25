import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCatalogueByPathServerFn } from "@/integrations/crystallize/catalogue";
import { removeLeadingSlash } from "@/lib/utils";

export const Route = createFileRoute("/$")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const catalogue = await getCatalogueByPathServerFn({
      data: { slug: params._splat },
    });

    if (!catalogue) {
      throw notFound();
    }

    return {
      catalogue,
    };
  },
});

function RouteComponent() {
  const { catalogue } = Route.useLoaderData();

  return (
    <div>
      <h1 className="text-2xl font-bold">{catalogue.name}</h1>
      <p>{catalogue.path}</p>
      <div>
        {catalogue?.subtree?.edges?.map((edge) => {
          if (!edge.node.path) {
            return null;
          }

          return (
            <div key={edge.node.id}>
              <Link
                to={`/$`}
                params={{ _splat: removeLeadingSlash(edge.node.path) }}
              >
                <h2>{edge.node.name}</h2>
              </Link>
            </div>
          );
        })}
      </div>
      <Link
        to="/$"
        params={{ _splat: removeLeadingSlash(catalogue.parent?.path ?? "/") }}
        className="underline"
      >
        Back
      </Link>
    </div>
  );
}
