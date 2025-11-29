import { createServerFn } from "@tanstack/react-start";
import { useAuthTokenSession, useCartSession } from "@/hooks/useSession";
import { crystallizeCart } from "@/integrations/crystallize/client";
import { getCartQuery } from "./getCart.query";

export const getCartServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const cartSession = await useCartSession();
    const authTokenSession = await useAuthTokenSession();

    if (!cartSession.data.cartId || !authTokenSession.data.token) {
      return null;
    }

    const response = await crystallizeCart({
      variables: {
        id: cartSession.data.cartId,
      },
      headers: {
        Authorization: `Bearer ${authTokenSession.data.token}`,
      },
      query: getCartQuery,
    });

    return response.data?.cart;
  },
);
