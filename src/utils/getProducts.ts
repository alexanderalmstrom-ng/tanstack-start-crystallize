import { graphql } from "@/gql";
import shopifyClient from "@/services/shopifyClient";

const productsQuery = graphql(`
    query Products {
      products(first: 100) {
        edges {
          node {
            title
            media(first: 10) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `);

export default async function getProducts() {
  const { data } = await shopifyClient(productsQuery);

  return data.data?.products?.edges?.map((edge) => edge.node);
}
