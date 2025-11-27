import { graphql } from "@/gql/cart";

export const getCartQuery = graphql(`
    query GetCart($id: UUID) {
      cart(id: $id) {
        id
      }
    }
  `);
