import { createTRPCRouter } from "./init";
import { crystallizeRouter } from "./routers/crystallize";

export const trpcRouter = createTRPCRouter({
  crystallize: crystallizeRouter,
});

export type TRPCRouter = typeof trpcRouter;
