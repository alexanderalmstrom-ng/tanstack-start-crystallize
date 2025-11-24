import { createTRPCRouter, publicProcedure } from "../init";

export const crystallizeRouter = createTRPCRouter({
  products: publicProcedure.query(() => {
    return undefined;
  }),
});
