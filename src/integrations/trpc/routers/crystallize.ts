import { graphql } from "@/gql";
import { crystallizeApiClient } from "@/integrations/crystallize/client";
import { createTRPCRouter, publicProcedure } from "../init";

export const crystallizeRouter = createTRPCRouter({
  products: publicProcedure.query(() => {
    return crystallizeApiClient({
      endpoint: "catalogue",
      query: graphql(`
        query Products {
          catalogue {
            subtree(type: product) {
              edges {
                node {
                  id
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
