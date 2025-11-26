import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/cart";
import { crystallizeCart } from "@/integrations/crystallize/client";

const getCartByIdServerFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ id: z.string(), token: z.string() }))
  .handler(async ({ data: { id, token } }) => {
    if (!id || !token) {
      return null;
    }

    const response = await crystallizeCart({
      variables: {
        id,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      query: graphql(`
        query GetCart($id: UUID) {
          cart(id: $id) {
            id
          }
        }
      `),
    });

    return response.data?.cart;
  });

export default getCartByIdServerFn;
