import { graphql } from "@/gql";

export default graphql(`
    fragment mediaImage on MediaImage {
      __typename
      id
      image {
        url
        altText
        width
        height
      }
    }
  `);
