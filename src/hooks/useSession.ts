import * as TanstackServer from "@tanstack/react-start/server";
import z from "zod";

type SessionData = {
  cartId?: string;
  token?: string;
};

export function useSession() {
  return TanstackServer.useSession<SessionData>({
    name: "session",
    maxAge: 2592000, // 30 days
    password: z.string().min(32).parse(process.env.SESSION_SECRET), // At least 32 characters
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
  });
}
