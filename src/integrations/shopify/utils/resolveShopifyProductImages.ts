import { getFragmentData } from "@/gql";
import type { ProductBySlugQuery } from "@/gql/graphql";
import mediaImageFragment from "../lib/media/mediaImage.fragment";

export function resolveShopifyProductImages(
  product: ProductBySlugQuery["product"],
) {
  return product?.media?.nodes.map((node) =>
    node.__typename === "MediaImage"
      ? getFragmentData(mediaImageFragment, node)
      : undefined,
  );
}
