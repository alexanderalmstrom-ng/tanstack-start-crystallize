import { graphql } from "@/gql/catalogue";

export const catalogueByPathQuery = graphql(`
    query CatalogueByPath($path: String!) {
      catalogue(path: $path) {
        id
        name
        path
        parent {
          path
        }
        subtree {
          edges {
            node {
              __typename
              id
              name
              path
            }
          }
        }
      }
    }
  `);
