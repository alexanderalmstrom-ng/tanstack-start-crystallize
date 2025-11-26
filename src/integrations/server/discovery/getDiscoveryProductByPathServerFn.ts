import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/discovery";
import { crystallizeDiscovery } from "@/integrations/crystallize/client";
import { normalizeSlug } from "@/lib/utils";

export const getDiscoveryProductByPathServerFn = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ path: z.string().default("/") }))
  .handler(async ({ data: { path } }) => {
    const product = await crystallizeDiscovery({
      variables: { path: normalizeSlug(path) },
      query: graphql(`
        query BrowseDiscoveryProductByPath($path: String!) {
          browse {
            product(path: $path) {
              hits {
                id
                name
                path
                variants {
                  images {
                    ...image
                  }
                }
              }
            }
          }
        }
      `),
    });

    return product?.data?.browse?.product?.hits?.[0];
  });
