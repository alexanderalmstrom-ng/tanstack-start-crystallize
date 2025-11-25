import { graphql } from "@/gql/discovery/gql";
import { crystallizeDiscovery } from "@/integrations/crystallize/client";
import { createTRPCRouter, publicProcedure } from "../init";

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
});
