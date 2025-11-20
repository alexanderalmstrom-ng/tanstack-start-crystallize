import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Image } from "@unpic/react";
import z from "zod";
import { getFragmentData, graphql } from "@/gql";
import type { ProductBySlugQuery } from "@/gql/graphql";
import shopifyClient from "@/services/shopify/client";

export const Route = createFileRoute("/product/$slug")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const product = await getProductBySlugServerFn({
      data: { slug: params.slug },
    });

    if (!product) {
      throw notFound();
    }

    return { product };
  },
});

function RouteComponent() {
  const { product } = Route.useLoaderData();
  const images = resolveProductImages(product);

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {images?.map(
        (image) =>
          image?.image?.url && (
            <picture className="bg-amber-50 flex">
              <Image
                key={image.id}
                src={image.image.url}
                alt={image.image.altText ?? ""}
                width={image.image.width ?? 2000}
                height={image.image.height ?? 2000}
                className="w-full h-full object-fit mix-blend-multiply"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="eager"
              />
            </picture>
          ),
      )}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">{product.title}</h1>
        {product.description && <p>{product.description}</p>}
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
