import z from "zod";

export default {
  tenantId: z
    .string()
    .parse(import.meta.env.VITE_CRYSTALLIZE_TENANT_IDENTIFIER),
  accessTokenId: z.string().parse(import.meta.env.CRYSTALLIZE_ACCESS_TOKEN_ID),
  accessTokenSecret: z
    .string()
    .parse(import.meta.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET),
};
