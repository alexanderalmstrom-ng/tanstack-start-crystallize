import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { crystallizeCart } from "@/integrations/crystallize/client";
import { createAuthTokenSessionMiddleware } from "../auth/createAuthTokenSessionMiddleware";
import { createCartSessionMiddleware } from "../auth/createCartSessionMiddleware";
import { addSkuItemMutation } from "./addSkuItem.mutation";

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
  .middleware([createCartSessionMiddleware, createAuthTokenSessionMiddleware])
  .inputValidator(AddToCartInputSchema)
  .handler(async ({ data }) => {
    const addSkuItemResponse = await addSkuItemServerFn({
      data: { items: data.items },
    });

    console.log(
      `Product with sku ${data.items[0].sku} (x ${data.items[0].quantity}) added to cart ${addSkuItemResponse?.id}`,
    );

    return addSkuItemResponse;
  });

const addSkuItemServerFn = createServerFn({
  method: "POST",
})
  .middleware([createCartSessionMiddleware, createAuthTokenSessionMiddleware])
  .inputValidator(AddToCartInputSchema)
  .handler(async ({ data, context }) => {
    const response = await crystallizeCart({
      headers: {
        Authorization: `Bearer ${context.token}`,
      },
      variables: {
        id: context.cartId,
        input: {
          sku: data.items[0].sku,
          quantity: data.items[0].quantity,
        },
      },
      query: addSkuItemMutation,
    });

    return response.data?.addSkuItem;
  });
