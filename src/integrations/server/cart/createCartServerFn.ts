import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/cart";
import { crystallizeCart } from "@/integrations/crystallize/client";
import { authTokenMiddleware } from "../auth/authTokenMiddleware";
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
  .middleware([authTokenMiddleware])
  .inputValidator(CreateCartInputSchema)
  .handler(async ({ data: { input } }) => {
    const token = await createAuthTokenServerFn();

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

    if (!response.data?.cart) {
      throw new Error("Failed to create cart");
    }

    return response.data?.cart;
  });
