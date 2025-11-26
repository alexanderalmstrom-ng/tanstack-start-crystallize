import { env } from "@/env";
import type { TypedDocumentString as CatalogueTypedDocumentString } from "@/gql/catalogue/graphql";
import type { TypedDocumentString as DiscoveryTypedDocumentString } from "@/gql/discovery/graphql";
import { crystallizeResponseSchema } from "./schema";

type CrystallizeApi = "api" | "shop-api";

type CrystallizeEndpoint = "catalogue" | "discovery" | "auth/token" | "cart";

type CrystallizeCatalogueClientProps<TResult, TVariables> = {
  api?: CrystallizeApi;
  endpoint: CrystallizeEndpoint;
  query: CatalogueTypedDocumentString<TResult, TVariables>;
  variables?: TVariables;
};

type CrystallizeDiscoveryClientProps<TResult, TVariables> = {
  api?: CrystallizeApi;
  endpoint: CrystallizeEndpoint;
  query: DiscoveryTypedDocumentString<TResult, TVariables>;
  variables?: TVariables;
};

type CrystallizeCatalogueApiProps<TResult, TVariables> = Omit<
  CrystallizeCatalogueClientProps<TResult, TVariables>,
  "api" | "endpoint"
>;

type CrystallizeDiscoveryApiProps<TResult, TVariables> = Omit<
  CrystallizeDiscoveryClientProps<TResult, TVariables>,
  "api" | "endpoint"
>;

export function crystallizeCatalogue<TResult, TVariables>(
  props: CrystallizeCatalogueApiProps<TResult, TVariables>,
) {
  return crystallizeClient<TResult, TVariables>({
    ...props,
    endpoint: "catalogue",
  });
}

export function crystallizeDiscovery<TResult, TVariables>(
  props: CrystallizeDiscoveryApiProps<TResult, TVariables>,
) {
  return crystallizeClient<TResult, TVariables>({
    ...props,
    endpoint: "discovery",
  });
}

async function crystallizeClient<TResult, TVariables>({
  api = "api",
  endpoint,
  query,
  variables,
}:
  | CrystallizeCatalogueClientProps<TResult, TVariables>
  | CrystallizeDiscoveryClientProps<TResult, TVariables>) {
  const response = await fetch(
    `https://${api}.crystallize.com/${env.CRYSTALLIZE_TENANT_IDENTIFIER}/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Crystallize-Access-Token-Id": env.CRYSTALLIZE_ACCESS_TOKEN_ID,
        "X-Crystallize-Access-Token-Secret":
          env.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
      },
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
  };
}
