import * as TanstackServer from "@tanstack/react-start/server";
import z from "zod";

type CartSessionData = {
  cartId?: string;
};

type AuthTokenSessionData = {
  token?: string;
};

export function useCartSession() {
  return TanstackServer.useSession<CartSessionData>({
    name: "cart",
    password: z.string().min(32).parse(process.env.SESSION_SECRET), // At least 32 characters
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 2592000, // 30 days
    },
  });
}

export function useAuthTokenSession() {
  return TanstackServer.useSession<AuthTokenSessionData>({
    name: "token",
    password: z.string().min(32).parse(process.env.SESSION_SECRET), // At least 32 characters
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 2592000, // 30 days
    },
  });
}
