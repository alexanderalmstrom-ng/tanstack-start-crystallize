import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getCartServerFn } from "./cart.server";

export function useCartQuery() {
  const getCart = useServerFn(getCartServerFn);

  return useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });
}
