import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/cart";
import { crystallizeCart } from "@/integrations/crystallize/client";
import { createAuthTokenSessionMiddleware } from "../auth/createAuthTokenSessionMiddleware";
import { createCartSessionMiddleware } from "../auth/createCartSessionMiddleware";

const AddSkuItemInputSchema = z.object({
  sku: z.string(),
  quantity: z.number(),
});

export const addSkuItemServerFn = createServerFn({
  method: "POST",
})
  .middleware([createAuthTokenSessionMiddleware, createCartSessionMiddleware])
  .inputValidator(AddSkuItemInputSchema)
  .handler(async ({ data, context }) => {
    const response = await crystallizeCart({
      headers: {
        Authorization: `Bearer ${context.token}`,
      },
      variables: {
        id: context.cartId,
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
