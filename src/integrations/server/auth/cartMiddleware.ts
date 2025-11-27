import { createMiddleware } from "@tanstack/react-start";
import z from "zod";
import { useSession } from "@/hooks/useSession";
import { createCartServerFn } from "../cart/createCartServerFn";

export const cartMiddleware = createMiddleware({
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
    const session = await useSession();

    if (!session.data.cartId) {
      const newCart = await createCartServerFn({
        data: { input: { items: data.items } },
      });

      await session.update({
        cartId: newCart?.id,
      });
    }

    if (!session.data.cartId) {
      throw new Error("Cart not found");
    }

    return next({
      context: {
        cartId: session.data.cartId,
      },
    });
  });
