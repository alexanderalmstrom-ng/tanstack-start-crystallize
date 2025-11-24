import { graphql } from "@/gql";
import shopifyClient from "@/integrations/shopify/client";

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
              ... on MediaImage {
                image {
                  id
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
