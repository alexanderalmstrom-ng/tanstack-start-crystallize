import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/catalogue";
import { normalizeSlug } from "@/lib/utils";
import { crystallizeApiClient } from "../client";

export const getCatalogueByPathServerFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().default("/") }))
  .handler(async ({ data: { slug } }) => {
    const response = await crystallizeApiClient({
      endpoint: "catalogue",
      variables: { path: normalizeSlug(slug) },
      query: graphql(`
        query CatalogueByPath($path: String!) {
          catalogue(path: $path) {
            id
            name
            path
            parent {
              path
            }
            subtree {
              edges {
                node {
                  __typename
                  id
                  name
                  path
                }
              }
            }
          }
        }
      `),
    });

    return response.data?.catalogue;
  });
