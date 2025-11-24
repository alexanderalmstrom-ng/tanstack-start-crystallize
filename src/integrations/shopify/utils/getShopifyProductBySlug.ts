import shopifyClient from "../client";
import productBySlugQuery from "../lib/product/productBySlug.query";

export async function getShopifyProductBySlug(slug: string) {
  return (await shopifyClient(productBySlugQuery, { slug })).data?.product;
}
