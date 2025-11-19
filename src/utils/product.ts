import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { graphql } from "@/gql";
import shopifyClient from "@/services/shopify/client";

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

export async function getProducts() {
  const { data } = await shopifyClient(productsQuery);
  return data?.products?.edges?.map((edge) => edge.node);
}

export const getProductsServerFn = createServerFn().handler(() =>
  getProducts(),
);
