import { getProducts } from "@/integrations/shopify/lib/product/products.query";
import { createTRPCRouter, publicProcedure } from "../init";

export const shopifyRouter = createTRPCRouter({
  products: publicProcedure.query(() => {
    return getProducts();
  }),
});
