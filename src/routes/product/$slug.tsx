import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProductBySlugServerFn } from "@/integrations/crystallize/server/product";

export const Route = createFileRoute("/product/$slug")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const product = await getProductBySlugServerFn({
      data: { slug: params.slug },
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
      <h1>{product.name}</h1>
    </div>
  );
}
