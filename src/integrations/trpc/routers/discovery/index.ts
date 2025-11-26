import z from "zod";
import { graphql } from "@/gql/discovery/gql";
import { crystallizeDiscovery } from "@/integrations/crystallize/client";
import { normalizeSlug } from "@/lib/utils";
import { createTRPCRouter, publicProcedure } from "../../init";

export const discoveryRouter = createTRPCRouter({
  products: publicProcedure.query(() => {
    return crystallizeDiscovery({
      query: graphql(`
        query DiscoveryProducts {
          browse {
            product {
              hits {
                id
                name
                path
              }
            }
          }
        }
      `),
    });
  }),
  productByPath: publicProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ input }) => {
      const response = await crystallizeDiscovery({
        variables: { path: normalizeSlug(input.path) },
        query: graphql(`
          query ProductByPath($path: String!) {
            browse {
              product(path: $path) {
                hits {
                  id
                  name
                  path
                }
              }
            }
          }
        `),
      });

      return response.data?.browse?.product?.hits;
    }),
});
