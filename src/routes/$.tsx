import { createFileRoute, notFound } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heading } from "@/components/ui/heading";
import { type FragmentType, getFragmentData } from "@/gql/discovery";
import type { ProductFragment } from "@/gql/discovery/graphql";
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

  const productVariantImages = product?.variants?.flatMap(
    (variant) => variant?.images,
  );

  return (
    <div className="grid lg:grid-cols-[2fr_minmax(32rem,1fr)]">
      <ProductGalleryCarousel images={productVariantImages} />
      <ProductDetails product={product} />
    </div>
  );
}

function ProductGalleryCarousel({
  images,
}: {
  images: (FragmentType<typeof imageFragment> | null | undefined)[] | undefined;
}) {
  if (!images) return null;

  const imagesWithUrl = images
    .map((image) => getFragmentData(imageFragment, image))
    .filter((image) => image?.url);

  return (
    <Carousel className="bg-secondary" opts={{ align: "start", loop: true }}>
      <CarouselContent className="xl:h-[calc(100vh-6.4375rem)]">
        {imagesWithUrl.map((image) => {
          if (!image?.url) return null;

          return (
            <CarouselItem key={image.url} className="bg-secondary">
              <Image
                src={image.url}
                width={image.width ?? 2000}
                height={image.height ?? 2000}
                alt={image.altText ?? ""}
                className="w-full h-full object-contain aspect-square mix-blend-multiply"
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

function ProductDetails({ product }: { product: ProductFragment }) {
  return (
    <div className="px-4 py-6 lg:p-10 flex flex-col gap-1">
      <Heading asChild>
        <h1 className="text-2xl lg:text-4xl">{product.name}</h1>
      </Heading>
      <Price amount={product.defaultVariant?.defaultPrice} />
    </div>
  );
}

function Price({ amount }: { amount: number | null | undefined }) {
  if (!amount) return null;

  const formattedAmount = formatPrice(amount);

  return <p className="text-lg">{formattedAmount}</p>;
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
