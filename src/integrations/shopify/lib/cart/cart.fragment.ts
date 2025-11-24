import { graphql } from "@/gql";

export default graphql(`
    fragment cart on Cart {
      __typename
      id
      createdAt
      updatedAt
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            cost {
              amountPerQuantity {
                amount
                currencyCode
              }
            }
            merchandise {
              ... on ProductVariant {
                id
                product {
                  title
                  featuredImage {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
      delivery {
        addresses {
            address {
                __typename
                ... on CartDeliveryAddress {
                    firstName
                    lastName
                    address1
                    address2
                    name
                    phone
                    zip
                    city
                    countryCode
                    provinceCode
                }
            }
        }
      }
      attributes {
        key
        value
      }
      # The estimated total cost of all merchandise that the customer will pay at checkout.
      cost {
        totalAmount {
          amount
          currencyCode
        }
        # The estimated amount, before taxes and discounts, for the customer to pay at checkout.
        subtotalAmount {
          amount
          currencyCode
        }
        checkoutChargeAmount {
            amount
            currencyCode
        }
        subtotalAmountEstimated
        totalAmountEstimated
      }
    }
  `);
