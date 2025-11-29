import { createContext, type ReactNode, use } from "react";
import { useCartQuery } from "@/hooks/useCartQuery";

type SessionContextType = {
  cart: ReturnType<typeof useCartQuery>["data"];
  cartIsLoading: ReturnType<typeof useCartQuery>["isLoading"];
  cartRefetch: ReturnType<typeof useCartQuery>["refetch"];
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const {
    data: cart,
    isLoading: cartIsLoading,
    refetch: cartRefetch,
  } = useCartQuery();

  console.log("useCartQuery cart", cart);

  return (
    <SessionContext.Provider value={{ cart, cartIsLoading, cartRefetch }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = use(SessionContext);

  if (!context) {
    throw new Error("useSessionContext must be used within SessionProvider");
  }

  return context;
}
