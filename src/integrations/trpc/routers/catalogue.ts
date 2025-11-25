import z from "zod";
import { graphql } from "@/gql/catalogue/gql";
import { crystallizeCatalogue } from "@/integrations/crystallize/client";
import { normalizeSlug } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "../init";

export const catalogueRouter = createTRPCRouter({
  catalogueSubtreeByPath: publicProcedure
    .input(z.object({ path: z.string().default("/") }))
    .query(async ({ input }) => {
      const response = await crystallizeCatalogue({
        variables: { path: normalizeSlug(input.path) },
        query: graphql(`
          query CatalogueSubtreeByPath($path: String!) {
            catalogue(path: $path) {
              subtree {
                edges {
                  node {
                    __typename
                    id
                    name
                    path
                    subtree {
                      edges {
                        node {
                          __typename
                          id
                          path
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `),
      });

      return response.data?.catalogue?.subtree?.edges?.map((edge) => edge.node);
    }),
  products: publicProcedure.query(async () => {
    const response = await crystallizeCatalogue({
      query: graphql(`
        query CatalogueProducts {
          catalogue {
            subtree(type: product) {
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

    return response.data?.catalogue?.subtree?.edges?.map((edge) => edge.node);
  }),
});
