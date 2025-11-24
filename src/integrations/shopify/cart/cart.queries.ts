import { graphql } from "@/gql";

export const getCartByIdQuery = graphql(`
  query getCartById($id: ID!) {
    cart(id: $id) {
      ...cart
    }
  }
`);
