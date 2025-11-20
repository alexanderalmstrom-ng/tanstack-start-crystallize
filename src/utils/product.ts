import { graphql } from "@/gql";
import type { ProductsQuery } from "@/gql/graphql";
import shopifyClient from "@/services/shopify/client";

type MediaNode =
  ProductsQuery["products"]["edges"][number]["node"]["media"]["nodes"][number];

export function isMediaImage(
  node: MediaNode,
): node is Extract<MediaNode, { __typename?: "MediaImage" }> {
  return node.__typename === "MediaImage";
}

export async function getProducts() {
  const { data } = await shopifyClient(productsQuery);
  return data?.products?.edges?.map((edge) => edge.node);
}

export const productsQuery = graphql(`
  query Products {
    products(first: 100) {
      edges {
        node {
          id
          title
          handle
          media(first: 10) {
            nodes {
              __typename
              id
              ... on MediaImage {
                image {
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
    }
  }
`);
