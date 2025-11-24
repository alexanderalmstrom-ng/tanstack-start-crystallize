import z from "zod";

const crystallizeConfigSchema = z.object({
  tenantId: z.string().min(1, "CRYSTALLIZE_TENANT_IDENTIFIER is required"),
  tokenId: z.string().min(1, "CRYSTALLIZE_ACCESS_TOKEN_ID is required"),
  tokenSecret: z.string().min(1, "CRYSTALLIZE_ACCESS_TOKEN_SECRET is required"),
});

function getCrystallizeConfig() {
  return crystallizeConfigSchema.parse({
    tenantId: process.env.CRYSTALLIZE_TENANT_IDENTIFIER,
    tokenId: process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
    tokenSecret: process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
  });
}

export const crystallizeConfig = getCrystallizeConfig();

export type CrystallizeConfig = z.infer<typeof crystallizeConfig>;
