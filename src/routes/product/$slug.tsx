import { createFileRoute, notFound } from "@tanstack/react-router";
import ProductForm from "@/integrations/shopify/components/ProductForm/ProductForm";
import ProductGallery from "@/integrations/shopify/components/ProductGallery/ProductGallery";
import { getProductBySlugServerFn } from "@/integrations/shopify/server/product";
import { resolveShopifyProductImages } from "@/integrations/shopify/utils/resolveShopifyProductImages";

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
  const images = resolveShopifyProductImages(product);

  return (
    <div className="grid lg:grid-cols-12">
      <ProductGallery images={images} />
      <div className="flex flex-col gap-6 lg:col-span-6 xl:col-span-5 lg:max-w-2xl lg:justify-self-center lg:py-16 lg:px-12 p-6">
        <h1 className="text-3xl">{product.title}</h1>
        {product.description && <p>{product.description}</p>}
        <ProductForm variantId={product.variants.nodes[0].id} />
      </div>
    </div>
  );
}
