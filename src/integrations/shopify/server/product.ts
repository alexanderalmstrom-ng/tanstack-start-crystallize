import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getShopifyProductBySlug } from "../utils/getShopifyProductBySlug";

export const getProductBySlugServerFn = createServerFn()
  .inputValidator(z.object({ slug: z.string() }))
  .handler(({ data: { slug } }) => {
    return getShopifyProductBySlug(slug);
  });
