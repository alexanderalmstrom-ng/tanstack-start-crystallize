import { createMiddleware } from "@tanstack/react-start";
import { useAuthTokenSession } from "@/hooks/useSession";
import { createAuthTokenServerFn } from "./createAuthTokenServerFn";

export const createAuthTokenSessionMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const authTokenSession = await useAuthTokenSession();

  if (!authTokenSession.data.token) {
    await authTokenSession.update({
      token: await createAuthTokenServerFn(),
    });
  }

  if (!authTokenSession.data.token) {
    throw new Error("Token not found");
  }

  return next({
    context: {
      token: authTokenSession.data.token,
    },
  });
});
