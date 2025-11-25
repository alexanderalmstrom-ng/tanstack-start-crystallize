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

  const images = product.variants
    ?.flatMap((variant) => variant?.images ?? [])
    .filter((image) => image?.url);

  return (
    <div className="grid lg:grid-cols-[2fr_minmax(32rem,1fr)]">
      <div className="bg-secondary no-scrollbar flex snap-x snap-mandatory flex-row flex-nowrap overflow-x-auto overflow-y-hidden">
        {images?.map((image) => {
          if (!image?.url) return null;

          return (
            <picture key={image.url} className="shrink-0 basis-full snap-start">
              <img
                className="w-full h-full object-cover aspect-square mix-blend-multiply"
                src={image.url}
                width={image.width ?? undefined}
                height={image.height ?? undefined}
                alt={image.altText ?? ""}
              />
            </picture>
          );
        })}
      </div>
      <div className="px-4 py-6 lg:p-10">
        <h1 className="text-2xl lg:text-4xl tracking-tight">{product.name}</h1>
      </div>
    </div>
  );
}
