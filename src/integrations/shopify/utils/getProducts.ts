import shopifyClient from "../client";
import { productsQuery } from "../lib/product/products.query";

export async function getProducts() {
  const { data } = await shopifyClient(productsQuery);
  return data?.products?.edges?.map((edge) => edge.node);
}
