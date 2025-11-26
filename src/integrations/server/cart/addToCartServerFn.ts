import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/cart";
import { useSession } from "@/hooks/useSession";
import { crystallizeCart } from "@/integrations/crystallize/client";
import { createCartServerFn } from "./createCartServerFn";

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
  .inputValidator(AddToCartInputSchema)
  .handler(async ({ data: { items } }) => {
    const session = await useSession();

    if (!session.data.cartId) {
      const newCartResponse = await createCartServerFn({
        data: {
          input: {
            items,
          },
        },
      });

      return newCartResponse;
    }

    const addSkuItemResponse = await crystallizeCart({
      headers: {
        Authorization: `Bearer ${session.data.token}`,
      },
      variables: {
        id: session.data.cartId,
        input: {
          sku: items[0].sku,
          quantity: items[0].quantity,
        },
      },
      query: graphql(`
        mutation AddSkuItem($id:UUID, $input: CartSkuItemInput!) { 
          addSkuItem(id: $id, input: $input) {
            id
          }
        }
      `),
    });

    return addSkuItemResponse.data?.addSkuItem;
  });
