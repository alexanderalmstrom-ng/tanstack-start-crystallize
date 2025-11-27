import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@/hooks/useSession";
import { crystallizeCart } from "@/integrations/crystallize/client";
import { getCartQuery } from "./getCart.query";

export const getCartServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useSession();

    if (!session.data.cartId || !session.data.token) {
      return null;
    }

    const response = await crystallizeCart({
      variables: {
        id: session.data.cartId,
      },
      headers: {
        Authorization: `Bearer ${session.data.token}`,
      },
      query: getCartQuery,
    });

    return response.data?.cart;
  },
);
