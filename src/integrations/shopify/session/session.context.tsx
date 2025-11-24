import { createContext, type ReactNode, use } from "react";
import { useCartQuery } from "../cart/cart.hooks";

type ShopifySessionContextType = {
  cart: ReturnType<typeof useCartQuery>["data"];
  cartIsLoading: ReturnType<typeof useCartQuery>["isLoading"];
  cartRefetch: ReturnType<typeof useCartQuery>["refetch"];
};

const ShopifySessionContext = createContext<
  ShopifySessionContextType | undefined
>(undefined);

export function ShopifySessionProvider({ children }: { children: ReactNode }) {
  const {
    data: cart,
    isLoading: cartIsLoading,
    refetch: cartRefetch,
  } = useCartQuery();

  return (
    <ShopifySessionContext.Provider
      value={{ cart, cartIsLoading, cartRefetch }}
    >
      {children}
    </ShopifySessionContext.Provider>
  );
}

export function useShopifySessionContext() {
  const context = use(ShopifySessionContext);

  if (!context) {
    throw new Error(
      "useShopifySessionContext must be used within ShopifySessionProvider",
    );
  }

  return context;
}
