import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getFragmentData } from "@/gql";
import shopifyClient from "@/integrations/shopify/client";
import cartFragment from "../lib/cart/cart.fragment";
import createCartMutation from "../lib/cart/cartCreate.mutation";
import cartLinesAddMutation from "../lib/cart/cartLinesAdd.mutation";
import { useAppSession } from "../lib/session/session.hooks";
import { getCartById } from "../utils/getCartById";

export const getCartServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useAppSession();

    if (!session.data.cartId) {
      return null;
    }

    return await getCartById(session.data.cartId);
  },
);

export const AddToCartSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().optional().default(1),
});

export const addToCartServerFn = createServerFn({ method: "POST" })
  .inputValidator(AddToCartSchema)
  .handler(async ({ data: { variantId, quantity } }) => {
    const session = await useAppSession();

    if (!session.data.cartId) {
      const { data } = await shopifyClient(createCartMutation, {
        lines: [{ quantity, merchandiseId: variantId }],
      });
      const cart = getFragmentData(cartFragment, data?.cartCreate?.cart);

      await session.update({ cartId: cart?.id });

      return cart;
    }

    const { data } = await shopifyClient(cartLinesAddMutation, {
      cartId: session.data.cartId,
      lines: [{ quantity, merchandiseId: variantId }],
    });
    const cart = getFragmentData(cartFragment, data?.cartLinesAdd?.cart);

    return cart;
  });
