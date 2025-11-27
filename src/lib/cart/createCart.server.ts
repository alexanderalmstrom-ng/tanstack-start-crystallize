import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { crystallizeCart } from "@/integrations/crystallize/client";
import { createAuthTokenServerFn } from "../auth/createAuthTokenServerFn";
import { createAuthTokenSessionMiddleware } from "../auth/createAuthTokenSessionMiddleware";
import { createCartMutation } from "./createCart.mutation";

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
  .middleware([createAuthTokenSessionMiddleware])
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
      query: createCartMutation,
    });

    if (!response.data?.cart) {
      throw new Error("Failed to create cart");
    }

    return response.data?.cart;
  });
