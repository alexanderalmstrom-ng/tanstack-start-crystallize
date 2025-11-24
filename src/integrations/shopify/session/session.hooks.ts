import { useSession } from "@tanstack/react-start/server";
import z from "zod";

type SessionData = {
  cartId?: string;
};

export function useAppSession() {
  return useSession<SessionData>({
    name: "app-session",
    password: z.string().min(32).parse(process.env.SESSION_SECRET), // At least 32 characters
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
  });
}
