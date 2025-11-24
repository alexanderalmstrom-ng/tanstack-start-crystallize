import { getFragmentData } from "@/gql";
import shopifyClient from "@/integrations/shopify/client";
import cartFragment from "../lib/cart/cart.fragment";
import cartQuery from "../lib/cart/cart.query";

export async function getCartById(cartId: string | undefined) {
  if (!cartId) {
    return null;
  }

  const { data } = await shopifyClient(cartQuery, { id: cartId });
  const cart = getFragmentData(cartFragment, data?.cart);

  return cart ?? null;
}
