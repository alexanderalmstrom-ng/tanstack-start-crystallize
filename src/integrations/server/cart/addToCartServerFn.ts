import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { useSession } from "@/hooks/useSession";
import { addSkuItemServerFn } from "./addSkuItemServerFn";
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

    // Handle the case where the cart is not created yet
    if (!session.data.cartId) {
      const createCartResponse = await createCartServerFn({
        data: {
          input: {
            items,
          },
        },
      });

      return createCartResponse;
    }

    if (!session.data.token) {
      throw new Error("Add to cart failed", {
        cause: "No auth token found in session",
      });
    }

    // Add the item to the existing cart
    const addSkuItemResponse = await addSkuItemServerFn({
      data: {
        cartId: session.data.cartId,
        token: session.data.token,
        sku: items[0].sku,
        quantity: items[0].quantity,
      },
    });

    console.log(
      `Product with sku ${items[0].sku} (x ${items[0].quantity}) added to cart ${addSkuItemResponse?.id}`,
    );

    return addSkuItemResponse;
  });
