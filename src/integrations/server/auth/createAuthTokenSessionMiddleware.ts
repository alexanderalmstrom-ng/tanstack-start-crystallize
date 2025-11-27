import { createMiddleware } from "@tanstack/react-start";
import { useSession } from "@/hooks/useSession";
import { createAuthTokenServerFn } from "./createAuthTokenServerFn";

export const createAuthTokenSessionMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const session = await useSession();

  if (!session.data.token) {
    await session.update({
      token: await createAuthTokenServerFn(),
    });
  }

  if (!session.data.token) {
    throw new Error("Token not found");
  }

  return next({
    context: {
      token: session.data.token,
    },
  });
});
