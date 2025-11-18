import z from "zod";
import type { TypedDocumentString } from "@/gql/graphql";

type ShopifyClientErrorLocation = {
  line: number;
  column: number;
};

type ShopifyClientErrorExtension = {
  code: string;
};

type ShopifyClientError = {
  message: string;
  extensions?: ShopifyClientErrorExtension;
  locations?: ShopifyClientErrorLocation[];
  path?: string[];
};

type ShopifyClientResponse<TResult> = {
  data: TResult | null;
  errors?: ShopifyClientError[];
};

export default async function shopifyClient<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables?: Record<string, unknown>,
) {
  const response = await fetch(
    `https://${z.string().min(1, "SHOPIFY_SHOP_NAME is required").parse(process.env.SHOPIFY_SHOP_NAME)}.myshopify.com/api/2025-10/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": z
          .string()
          .min(1, "SHOPIFY_ACCESS_TOKEN is required")
          .parse(process.env.SHOPIFY_ACCESS_TOKEN),
      },
      body: JSON.stringify({
        query: query.toString(),
        variables: variables ? JSON.stringify(variables) : undefined,
      }),
    },
  );

  if (!response.ok) {
    console.error(await response.json());
    throw new Error(`Failed to fetch Shopify API: ${response.statusText}`);
  }

  return (await response.json()) as ShopifyClientResponse<TResult>;
}
