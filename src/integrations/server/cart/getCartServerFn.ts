import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@/hooks/useSession";
import getCartByIdServerFn from "./getCartByIdServerFn";

export const getCartServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await useSession();

    if (!session.data.cartId || !session.data.token) {
      return null;
    }

    return await getCartByIdServerFn({
      data: { id: session.data.cartId, token: session.data.token },
    });
  },
);
