import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/cart";
import { crystallizeCart } from "@/integrations/crystallize/client";

const AddSkuItemInputSchema = z.object({
  cartId: z.string(),
  token: z.string(),
  sku: z.string(),
  quantity: z.number(),
});

export const addSkuItemServerFn = createServerFn({
  method: "POST",
})
  .inputValidator(AddSkuItemInputSchema)
  .handler(async ({ data: { cartId, token, sku, quantity } }) => {
    const response = await crystallizeCart({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      variables: {
        id: cartId,
        input: {
          sku,
          quantity,
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
