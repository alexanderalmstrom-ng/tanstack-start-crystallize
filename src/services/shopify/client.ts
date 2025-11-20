import type { TypedDocumentString } from "@/gql/graphql";
import { isServer } from "@/utils/common";
import { shopifyConfig } from "./config";
import { shopifyResponseSchema } from "./schema";

export default async function shopifyClient<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables?: TVariables,
) {
  const response = await fetch(
    `https://${shopifyConfig.shopName}.myshopify.com/api/2025-10/graphql.json`,
    {
      method: "POST",
      headers: getShopifyClientHeaders(),
      body: JSON.stringify({
        query: query.toString(),
        variables: variables || undefined,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Shopify API error:", errorData);
    throw new Error(`Failed to fetch Shopify API: ${response.statusText}`);
  }

  const json = await response.json();
  const validation = shopifyResponseSchema<TResult>().safeParse(json);

  if (!validation.success) {
    console.error("Validation error:", validation.error);
    throw new Error(
      `Failed to validate Shopify API response: ${validation.error.message}`,
    );
  }

  const validatedData = validation.data;

  // Throw if there are GraphQL errors
  if (validatedData.errors && validatedData.errors.length > 0) {
    const errorMessages = validatedData.errors
      .map((error) => error.message)
      .join(", ");
    throw new Error(`Shopify GraphQL errors: ${errorMessages}`);
  }

  return {
    data: validatedData.data,
    errors: validatedData.errors,
    extensions: validatedData.extensions,
  };
}

function getShopifyClientHeaders() {
  if (
    isServer() &&
    "privateToken" in shopifyConfig &&
    typeof shopifyConfig.privateToken === "string"
  ) {
    return {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": shopifyConfig.privateToken,
    } as HeadersInit;
  }

  if (
    "publicToken" in shopifyConfig &&
    typeof shopifyConfig.publicToken === "string"
  ) {
    return {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": shopifyConfig.publicToken,
    } as HeadersInit;
  }

  throw new Error(
    "No Shopify client headers found. Please check your Shopify config.",
  );
}
