import { graphql } from "@/gql";

export const createCartMutation = graphql(`
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

export const cartLinesAddMutation = graphql(`
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
    }
  }
`);
