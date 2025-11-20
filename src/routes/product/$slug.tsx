import {
  formOptions,
  mergeForm,
  useForm,
  useTransform,
} from "@tanstack/react-form-start";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useStore } from "@tanstack/react-store";
import { Image } from "@unpic/react";
import z from "zod";
import AddToCartButton, {
  addToCartServerFn,
} from "@/components/AddToCartButton/AddToCartButton";
import { getFragmentData, graphql } from "@/gql";
import type { ProductBySlugQuery } from "@/gql/graphql";
import shopifyClient from "@/integrations/shopify/client";
import { getFormDataFromServer } from "@/lib/form";

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
      state: await getFormDataFromServer(),
    };
  },
});

function RouteComponent() {
  const { product, state } = Route.useLoaderData();
  const images = resolveProductImages(product);
  const formOpts = formOptions({
    defaultValues: {
      variantId: product.variants.nodes[0]?.id,
      quantity: 1,
    },
  });
  const form = useForm({
    ...formOpts,
    transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
  });
  const formErrors = useStore(form.store, (formState) => formState.errors);

  return (
    <div className="grid lg:grid-cols-12">
      {images?.map(
        (image) =>
          image?.image?.url && (
            <picture className="bg-secondary lg:col-span-6 xl:col-span-7">
              <Image
                key={image.id}
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
        <form
          method="post"
          action={addToCartServerFn.url}
          encType="multipart/form-data"
        >
          <form.Field name="variantId">
            {(field) => {
              return (
                <div>
                  <input
                    name="variantId"
                    type="hidden"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              );
            }}
          </form.Field>
          <form.Field name="quantity">
            {(field) => {
              return (
                <div>
                  <input
                    name="quantity"
                    type="number"
                    value={field.state.value}
                    onChange={(event) =>
                      field.handleChange(event.target.valueAsNumber)
                    }
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                </div>
              );
            }}
          </form.Field>
          <form.Subscribe
            selector={(formState) => [
              formState.canSubmit,
              formState.isSubmitting,
            ]}
          >
            {([canSubmit, isSubmitting]) => (
              <AddToCartButton
                variantId={product.variants.nodes[0].id}
                disabled={!canSubmit || isSubmitting}
              >
                {canSubmit && isSubmitting
                  ? "Adding to cart..."
                  : "Add to cart"}
              </AddToCartButton>
            )}
          </form.Subscribe>
          {formErrors.map((error) => (
            <p key={error as never as string}>{error}</p>
          ))}
        </form>
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
