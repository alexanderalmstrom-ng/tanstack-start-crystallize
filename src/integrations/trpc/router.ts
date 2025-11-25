import { createTRPCRouter } from "./init";
import { catalogueRouter } from "./routers/catalogue";
import { discoveryRouter } from "./routers/discovery";

export const trpcRouter = createTRPCRouter({
  catalogue: catalogueRouter,
  discovery: discoveryRouter,
});

export type TRPCRouter = typeof trpcRouter;
