import { graphql } from "@/gql/discovery";

export const productFragment = graphql(`
  fragment product on product {
    id
    name
    path
    variants {
        images {
            ...image
        }
    }
  }
`);
