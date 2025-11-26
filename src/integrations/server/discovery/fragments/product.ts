import { graphql } from "@/gql/discovery";

export const productFragment = graphql(`
  fragment product on product {
    name
    breadcrumbs {
      name
      path
    }
    defaultVariant {
      defaultPrice
    }
    variants {
      name
      sku
      attributes
      isDefault
      defaultPrice
      priceVariants
      images {
          ...image
      }
    }
  }
`);
