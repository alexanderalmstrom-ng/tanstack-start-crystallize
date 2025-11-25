import { graphql } from "@/gql/discovery/gql";
import { crystallizeApiClient } from "@/integrations/crystallize/client";
import { createTRPCRouter, publicProcedure } from "../init";

export const discoveryRouter = createTRPCRouter({
  products: publicProcedure.query(() => {
    return crystallizeApiClient({
      endpoint: "discovery",
      query: graphql(`
        query DiscoveryProducts {
          browse {
            product {
              hits {
                name
              }
            }
          }
        }
      `),
    });
  }),
});
