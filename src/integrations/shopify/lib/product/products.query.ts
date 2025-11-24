import { graphql } from "@/gql";

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
