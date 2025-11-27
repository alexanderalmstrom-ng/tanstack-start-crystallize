import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/cart";
import { crystallizeCart } from "@/integrations/crystallize/client";
import { authTokenMiddleware } from "../auth/authTokenMiddleware";
import { cartMiddleware } from "../auth/cartMiddleware";

const AddSkuItemInputSchema = z.object({
  sku: z.string(),
  quantity: z.number(),
});

export const addSkuItemServerFn = createServerFn({
  method: "POST",
})
  .middleware([authTokenMiddleware, cartMiddleware])
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
