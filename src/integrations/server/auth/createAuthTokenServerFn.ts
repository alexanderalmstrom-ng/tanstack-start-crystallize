import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { env } from "@/env";

const CreateAuthTokenResponseSchema = z
  .object({
    success: z.literal(true),
    token: z.string(),
  })
  .or(
    z.object({
      success: z.literal(false),
      error: z.string(),
    }),
  );

export const createAuthTokenServerFn = createServerFn({
  method: "POST",
}).handler(async () => {
  const response = await fetch(
    `https://shop-api.crystallize.com/${env.CRYSTALLIZE_TENANT_IDENTIFIER}/auth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Crystallize-Access-Token-Id": env.CRYSTALLIZE_ACCESS_TOKEN_ID,
        "X-Crystallize-Access-Token-Secret":
          env.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
      },
      body: JSON.stringify({
        scopes: ["cart", "cart:admin"],
        expiresIn: 2592000, // 30 days
      }),
    },
  );

  const validation = CreateAuthTokenResponseSchema.safeParse(
    await response.json(),
  );

  if (!validation.success) {
    console.error("Failed to validate auth token response", validation.error);
    throw new Error(validation.error.message);
  }

  if ("error" in validation.data) {
    console.error("Failed to fetch auth token", validation.data.error);
    throw new Error(validation.data.error);
  }

  return validation.data.token;
});
