import { graphql } from "@/gql";

export default graphql(`
    query ProductBySlug($slug: String!) {
      product(handle: $slug) {
        id
        title
        description
        media(first: 1) {
          nodes {
            ...mediaImage
          }
        }
        variants(first: 10) {
          nodes {
            id
          }
        }
      }
    }
  `);
