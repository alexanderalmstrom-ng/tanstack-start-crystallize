import { getProducts } from "@/integrations/shopify/utils/getProducts";
import { createTRPCRouter, publicProcedure } from "../init";

export const shopifyRouter = createTRPCRouter({
  products: publicProcedure.query(() => {
    return getProducts();
  }),
});
