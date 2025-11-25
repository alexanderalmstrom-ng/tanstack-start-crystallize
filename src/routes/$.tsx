import { createFileRoute, notFound } from "@tanstack/react-router";
import ProductDetails from "@/components/ProductDetails/ProductDetails";
import ProductGallery from "@/components/ProductGallery/ProductGallery";
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
  const variantImages = product.variants?.flatMap((variant) => variant?.images);

  return (
    <div className="grid lg:grid-cols-[2fr_minmax(32rem,1fr)]">
      <ProductGallery images={variantImages} />
      <ProductDetails product={product} />
    </div>
  );
}
