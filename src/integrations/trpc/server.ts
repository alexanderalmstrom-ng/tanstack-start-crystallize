import { createTRPCContext } from "@trpc/tanstack-react-query";
import { trpcRouter } from "./router";

export const caller = trpcRouter.createCaller(createTRPCContext);
