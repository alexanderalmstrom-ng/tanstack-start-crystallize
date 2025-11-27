import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/catalogue";
import { crystallizeCatalogue } from "@/integrations/crystallize/client";
import { normalizeSlug } from "@/lib/utils";

export const getCatalogueByPathServerFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ path: z.string().default("/") }))
  .handler(async ({ data: { path } }) => {
    const response = await crystallizeCatalogue({
      variables: { path: normalizeSlug(path) },
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
