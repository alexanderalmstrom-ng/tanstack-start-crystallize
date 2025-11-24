import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { normalizeSlug } from "@/lib/utils";
import { getProductBySlug } from "../utils/getCrystallizeProductBySlug";

export const getProductBySlugServerFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data: { slug } }) => {
    return await getProductBySlug(normalizeSlug(slug));
  });
