import { createServerFn } from "@tanstack/react-start";
import { graphql } from "@/gql/discovery";
import { crystallizeDiscovery } from "../client";

export const getDiscoveryProductsServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const products = await crystallizeDiscovery({
    query: graphql(`
      query BrowseDiscoveryProducts {
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

  return products?.data?.browse?.product?.hits;
});
