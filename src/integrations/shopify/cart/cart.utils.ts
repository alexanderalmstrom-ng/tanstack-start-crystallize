import { getFragmentData } from "@/gql";
import shopifyClient from "@/integrations/shopify/client";
import cartFragment from "./cart.fragments";
import { getCartByIdQuery } from "./cart.queries";

export async function getCartById(cartId: string | undefined) {
  if (!cartId) {
    return null;
  }

  const { data } = await shopifyClient(getCartByIdQuery, { id: cartId });
  const cart = getFragmentData(cartFragment, data?.cart);

  return cart ?? null;
}
