import { createServerFn } from "@tanstack/react-start";
import { graphql } from "@/gql/discovery";
import { crystallizeDiscovery } from "@/integrations/crystallize/client";

export const getProductsServerFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const products = await crystallizeDiscovery({
    query: graphql(`
      query GetProducts {
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
