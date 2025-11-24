import { graphql } from "@/gql";

export default graphql(`
  query cart($id: ID!) {
    cart(id: $id) {
      ...cart
    }
  }
`);
