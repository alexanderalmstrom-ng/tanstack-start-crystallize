import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { useForm } from "react-hook-form";
import z from "zod";
import Price from "@/components/Price/Price";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FragmentType } from "@/gql/discovery";
import type { ProductFragment } from "@/gql/discovery/graphql";
import type { imageFragment } from "@/integrations/server/discovery/fragments/image";
import { getDiscoveryProductByPathServerFn } from "@/integrations/server/discovery/getDiscoveryProductByPathServerFn";
import { resolveImagesFragment } from "@/integrations/server/discovery/utils/resolveImagesFragment";
import resolveProductVariantsFragment from "@/integrations/server/discovery/utils/resolveProductVariantsFragment";

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
  pendingComponent: () => <div>Loading...</div>,
});

function RouteComponent() {
  const { product } = Route.useLoaderData();
  const productVariants = resolveProductVariantsFragment(product?.variants);
  const productVariantImages = productVariants?.flatMap(
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
  if (!images || images.length === 0) return null;

  const imagesWithUrl = resolveImagesFragment(images);

  if (!imagesWithUrl || imagesWithUrl.length === 0) return null;

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
      <VariantSelector product={product} />
      <ProductForm product={product} />
    </div>
  );
}

function VariantSelector({ product }: { product: ProductFragment }) {
  const variants = resolveProductVariantsFragment(product?.variants);

  return (
    <div>
      {variants?.map(
        (variant) => variant && <div key={variant.sku}>{variant.name}</div>,
      )}
    </div>
  );
}

const productFormSchema = z.object({
  variant: z.string().min(1),
});

function ProductForm({ product }: { product: ProductFragment }) {
  const variants = resolveProductVariantsFragment(product?.variants);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      variant: variants?.[0]?.sku ?? "",
    },
  });

  const onSubmit = (data: z.infer<typeof productFormSchema>) => {
    console.log("data", data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="variant"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Variant</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger className="w-full" id={field.name}>
                    <SelectValue placeholder="Select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {variants?.map(
                        (variant) =>
                          variant?.sku && (
                            <SelectItem key={variant.sku} value={variant.sku}>
                              {variant.name}
                            </SelectItem>
                          ),
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add to cart</Button>
      </form>
    </Form>
  );
}
