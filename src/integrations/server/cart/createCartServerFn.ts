import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/cart";
import { useSession } from "@/hooks/useSession";
import { crystallizeCart } from "@/integrations/crystallize/client";
import { createAuthTokenServerFn } from "../auth/createAuthTokenServerFn";

const CreateCartInputSchema = z.object({
  input: z.object({
    items: z.array(
      z.object({
        sku: z.string(),
        quantity: z.number().default(1),
      }),
    ),
  }),
});

export const createCartServerFn = createServerFn({
  method: "POST",
})
  .inputValidator(CreateCartInputSchema)
  .handler(async ({ data: { input } }) => {
    const session = await useSession();
    const token = await createAuthTokenServerFn({
      data: {
        scopes: ["cart", "cart:admin"],
        expiresIn: 18000, // 5 hours
      },
    });

    await session.update({
      token,
    });

    const response = await crystallizeCart({
      headers: {
        Authorization: `Bearer ${token}`,
      },
      variables: {
        input,
      },
      query: graphql(`
        mutation CreateCart($input: CartInput!) {
          cart: hydrate(input: $input) {
            id
          }
        }
        `),
    });

    await session.update({
      cartId: response.data?.cart?.id,
    });

    console.log("Cart created with id:", response.data?.cart?.id);

    return response.data?.cart;
  });
