import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/cart";
import { crystallizeCart } from "@/integrations/crystallize/client";
import { createAuthTokenSessionMiddleware } from "../auth/createAuthTokenSessionMiddleware";
import { createCartSessionMiddleware } from "../auth/createCartSessionMiddleware";

const AddToCartInputSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string(),
      quantity: z.number().default(1),
    }),
  ),
});

export const addToCartServerFn = createServerFn({
  method: "POST",
})
  .middleware([createCartSessionMiddleware])
  .inputValidator(AddToCartInputSchema)
  .handler(async ({ data: { items }, context }) => {
    const addSkuItemResponse = await addSkuItemServerFn({
      data: {
        sku: items[0].sku,
        quantity: items[0].quantity,
        cartId: context.cartId,
      },
    });

    console.log(
      `Product with sku ${items[0].sku} (x ${items[0].quantity}) added to cart ${addSkuItemResponse?.id}`,
    );

    return addSkuItemResponse;
  });

const AddSkuItemInputSchema = z.object({
  sku: z.string(),
  quantity: z.number(),
  cartId: z.string(),
});

const addSkuItemServerFn = createServerFn({
  method: "POST",
})
  .middleware([createAuthTokenSessionMiddleware])
  .inputValidator(AddSkuItemInputSchema)
  .handler(async ({ data, context }) => {
    const response = await crystallizeCart({
      headers: {
        Authorization: `Bearer ${context.token}`,
      },
      variables: {
        id: data.cartId,
        input: {
          sku: data.sku,
          quantity: data.quantity,
        },
      },
      query: graphql(`
            mutation AddSkuItem($id: UUID, $input: CartSkuItemInput!) { 
              addSkuItem(id: $id, input: $input) {
                id
              }
            }
          `),
    });

    return response.data?.addSkuItem;
  });
