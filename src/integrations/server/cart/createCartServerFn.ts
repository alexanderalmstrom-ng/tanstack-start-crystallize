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
      variables: {
        input,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      query: graphql(`
        mutation CreateCart($input: CartInput!) {
          hydrate(input: $input) {
            id
          }
        }
        `),
    });

    await session.update({
      cartId: response.data?.hydrate?.id,
    });

    return response.data?.hydrate;
  });
