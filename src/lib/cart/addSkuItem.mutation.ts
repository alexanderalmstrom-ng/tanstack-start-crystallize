import { graphql } from "@/gql/cart";

export const addSkuItemMutation = graphql(`
    mutation AddSkuItem($id: UUID, $input: CartSkuItemInput!) { 
      addSkuItem(id: $id, input: $input) {
        id
      }
    }
  `);
