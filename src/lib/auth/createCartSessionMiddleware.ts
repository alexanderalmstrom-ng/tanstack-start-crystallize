import { createMiddleware } from "@tanstack/react-start";
import z from "zod";
import { useCartSession } from "@/hooks/useSession";
import { createCartServerFn } from "../cart/createCart.server";

export const createCartSessionMiddleware = createMiddleware({
  type: "function",
})
  .inputValidator(
    z.object({
      items: z.array(
        z.object({
          sku: z.string(),
          quantity: z.number().default(1),
        }),
      ),
    }),
  )
  .server(async ({ next, data }) => {
    const cartSession = await useCartSession();

    if (!cartSession.data.cartId) {
      const newCart = await createCartServerFn({
        data: { input: { items: data.items } },
      });

      await cartSession.update({
        cartId: newCart?.id,
      });
    }

    if (!cartSession.data.cartId) {
      throw new Error("Cart not found");
    }

    return next({
      context: {
        cartId: cartSession.data.cartId,
      },
    });
  });
