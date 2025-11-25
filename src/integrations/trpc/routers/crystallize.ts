import z from "zod";
import { graphql } from "@/gql";
import { crystallizeApiClient } from "@/integrations/crystallize/client";
import { normalizeSlug } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "../init";

export const crystallizeRouter = createTRPCRouter({
  catalogueSubtreeByPath: publicProcedure
    .input(z.object({ path: z.string().default("/") }))
    .query(({ input }) => {
      return crystallizeApiClient({
        endpoint: "catalogue",
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
    }),
  products: publicProcedure.query(() => {
    return crystallizeApiClient({
      endpoint: "catalogue",
      query: graphql(`
        query Products {
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
  }),
});
