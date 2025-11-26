import { createFileRoute, notFound } from "@tanstack/react-router";
import { type FragmentType, getFragmentData } from "@/gql/discovery";
import type { Product } from "@/gql/discovery/graphql";
import { imageFragment } from "@/integrations/server/discovery/fragments/image";
import { getDiscoveryProductByPathServerFn } from "@/integrations/server/discovery/getDiscoveryProductByPathServerFn";

export const Route = createFileRoute("/$")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const product = await getDiscoveryProductByPathServerFn({
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

export default function ProductGallery({
  images,
}: {
  images: (FragmentType<typeof imageFragment> | null | undefined)[] | undefined;
}) {
  if (!images) return null;

  const imagesWithUrl = images
    .map((image) => getFragmentData(imageFragment, image))
    .filter((image) => image?.url);

  return (
    <div className="bg-secondary no-scrollbar flex snap-x snap-mandatory flex-row flex-nowrap overflow-x-auto overflow-y-hidden">
      {imagesWithUrl.map((image) => {
        if (!image?.url) return null;

        return (
          <picture
            key={image.url}
            className="shrink-0 basis-full snap-start bg-secondary"
          >
            <img
              className="w-full h-full object-contain aspect-square mix-blend-multiply"
              src={image.url}
              width={image.width ?? 2000}
              height={image.height ?? 2000}
              alt={image.altText ?? ""}
            />
          </picture>
        );
      })}
    </div>
  );
}

function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="px-4 py-6 lg:p-10">
      <h1 className="text-2xl lg:text-4xl tracking-tight">{product.name}</h1>
    </div>
  );
}
