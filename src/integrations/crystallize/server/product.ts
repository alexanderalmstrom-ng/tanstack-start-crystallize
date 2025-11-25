import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql";
import { normalizeSlug } from "@/lib/utils";
import { crystallizeApiClient } from "../client";

export const getProductBySlugServerFn = createServerFn({ method: "GET" })
  .inputValidator(
    z
      .object({ slug: z.string() })
      .transform(({ slug }) => ({ slug: normalizeSlug(slug) })),
  )
  .handler(async ({ data: { slug } }) => {
    const response = await crystallizeApiClient({
      query: graphql(`
        query ProductBySlug($slug: String!) {
          catalogue(path: $slug, pathResolutionMethods: alias) {
            id
            name
          }
        }
      `),
      endpoint: "catalogue",
      variables: { slug },
    });

    return response.data?.catalogue;
  });
