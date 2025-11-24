import { graphql } from "@/gql";

export default graphql(`
    mutation cartCreate($lines: [CartLineInput!]!) {
      cartCreate(
        input: {
          lines: $lines
        }
      ) {
        cart {
          ...cart
        }
      }
    }
  `);
