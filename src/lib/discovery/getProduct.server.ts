import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { getFragmentData, graphql } from "@/gql/discovery";
import { crystallizeDiscovery } from "@/integrations/crystallize/client";
import { normalizeSlug } from "@/lib/utils";
import { productFragment } from "./fragments/product.fragment";

export const getProductByPathServerFn = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ path: z.string().default("/") }))
  .handler(async ({ data: { path } }) => {
    const product = await crystallizeDiscovery({
      variables: { path: normalizeSlug(path) },
      query: graphql(`
        query GetProductByPath($path: String!) {
          browse {
            product(path: $path) {
              hits {
                ...product
              }
            }
          }
        }
      `),
    });

    return getFragmentData(
      productFragment,
      product?.data?.browse?.product?.hits?.[0],
    );
  });
