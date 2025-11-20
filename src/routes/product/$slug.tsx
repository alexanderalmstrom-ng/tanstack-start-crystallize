import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Image } from "@unpic/react";
import z from "zod";
import ProductForm from "@/components/ProductForm/ProductForm";
import { getFragmentData, graphql } from "@/gql";
import type { ProductBySlugQuery } from "@/gql/graphql";
import shopifyClient from "@/integrations/shopify/client";

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
  const images = resolveProductImages(product);

  return (
    <div className="grid lg:grid-cols-12">
      {images?.map(
        (image) =>
          image?.image?.url && (
            <picture
              className="bg-secondary lg:col-span-6 xl:col-span-7"
              key={image.id}
            >
              <Image
                src={image.image.url}
                alt={image.image.altText ?? ""}
                width={image.image.width ?? 2000}
                height={image.image.height ?? 2000}
                className="w-full h-full object-contain mix-blend-multiply aspect-square"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="eager"
              />
            </picture>
          ),
      )}
      <div className="flex flex-col gap-6 lg:col-span-6 xl:col-span-5 lg:max-w-2xl lg:justify-self-center lg:py-16 lg:px-12 p-6">
        <h1 className="text-3xl">{product.title}</h1>
        {product.description && <p>{product.description}</p>}
        <ProductForm variantId={product.variants.nodes[0].id} />
      </div>
    </div>
  );
}

const mediaImageFragment = graphql(`
  fragment mediaImage on MediaImage {
    __typename
    id
    image {
      url
      altText
      width
      height
    }
  }
`);

const productBySlugQuery = graphql(`
  query ProductBySlug($slug: String!) {
    product(handle: $slug) {
      id
      title
      description
      media(first: 1) {
        nodes {
          ...mediaImage
        }
      }
      variants(first: 10) {
        nodes {
          id
        }
      }
    }
  }
`);

async function getProductBySlug(slug: string) {
  return (await shopifyClient(productBySlugQuery, { slug })).data?.product;
}

const getProductBySlugServerFn = createServerFn()
  .inputValidator(z.object({ slug: z.string() }))
  .handler(({ data: { slug } }) => getProductBySlug(slug));

const resolveProductImages = (product: ProductBySlugQuery["product"]) => {
  return product?.media?.nodes.map((node) =>
    node.__typename === "MediaImage"
      ? getFragmentData(mediaImageFragment, node)
      : undefined,
  );
};
