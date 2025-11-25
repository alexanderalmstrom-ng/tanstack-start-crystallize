import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql/discovery";
import { normalizeSlug } from "@/lib/utils";
import { crystallizeDiscovery } from "../client";

export const getDiscoveryProductByPath = createServerFn({
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
                    url
                    altText
                    width
                    height
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
