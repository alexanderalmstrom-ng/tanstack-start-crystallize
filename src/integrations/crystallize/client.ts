import "server-only";

import type { TypedDocumentString } from "@/gql/graphql";
import { crystallizeConfig } from "./config";
import { crystallizeResponseSchema } from "./schema";

type CrystallizeClientProps<TResult, TVariables> = {
  api?: "api" | "shop-api";
  endpoint: "catalogue" | "discovery" | "auth/token" | "cart";
  query: TypedDocumentString<TResult, TVariables>;
  variables?: TVariables;
};

type CrystallizeApiClientProps<TResult, TVariables> = Omit<
  CrystallizeClientProps<TResult, TVariables>,
  "api"
>;

type CrystallizeShopApiClientProps<TResult, TVariables> = Omit<
  CrystallizeClientProps<TResult, TVariables>,
  "api"
>;

export function crystallizeApiClient<TResult, TVariables>(
  props: CrystallizeApiClientProps<TResult, TVariables>,
) {
  return crystallizeClient({ ...props });
}

export function crystallizeShopApiClient<TResult, TVariables>(
  props: CrystallizeShopApiClientProps<TResult, TVariables>,
) {
  return crystallizeClient({ api: "shop-api", ...props });
}

async function crystallizeClient<TResult, TVariables>({
  api = "api",
  endpoint,
  query,
  variables,
}: CrystallizeClientProps<TResult, TVariables>) {
  const response = await fetch(
    `https://${api}.crystallize.com/${crystallizeConfig.tenantId}/${endpoint}`,
    {
      method: "POST",
      headers: getCrystallizeClientHeaders(),
      body: JSON.stringify({
        query: query.toString(),
        variables: variables || undefined,
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Crystallize API error:", errorData);
    throw new Error(`Failed to fetch Crystallize API: ${response.statusText}`);
  }

  const json = await response.json();
  const validation = crystallizeResponseSchema<TResult>().safeParse(json);

  if (!validation.success) {
    console.error("Validation error:", validation.error);
    throw new Error(
      `Failed to validate Crystallize API response: ${validation.error.message}`,
    );
  }

  const validatedData = validation.data;

  // Throw if there are GraphQL errors
  if (validatedData.errors && validatedData.errors.length > 0) {
    const errorMessages = validatedData.errors
      .map((error) => error.message)
      .join(", ");
    throw new Error(`Crystallize GraphQL errors: ${errorMessages}`);
  }

  return {
    data: validatedData.data,
    errors: validatedData.errors,
    extensions: validatedData.extensions,
  };
}

function getCrystallizeClientHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Crystallize-Access-Token-Id": crystallizeConfig.tokenId,
    "X-Crystallize-Access-Token-Secret": crystallizeConfig.tokenSecret,
  };
}
