import { graphql } from "@/gql/cart";

export const createCartMutation = graphql(`
    mutation CreateCart($input: CartInput!) {
      cart: hydrate(input: $input) {
        id
      }
    }
  `);
