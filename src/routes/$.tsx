import { createFileRoute, notFound } from "@tanstack/react-router";
import { getDiscoveryProductByPath } from "@/integrations/crystallize/discovery/getDiscoveryProductByPath";

export const Route = createFileRoute("/$")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const product = await getDiscoveryProductByPath({
      data: { path: params._splat },
    });

    if (!product) {
      throw notFound();
    }

    return {
      product,
    };
  },
});

function RouteComponent() {
  const { product } = Route.useLoaderData();

  return (
    <div>
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.path}</p>
    </div>
  );
}
