import { graphql } from "@/gql";
import { crystallizeApiClient } from "../client";

const productBySlugQuery = graphql(`
  query ProductBySlug($slug: String!) {
    catalogue(path: $slug, pathResolutionMethods: alias) {
      id
      name
    }
  }
`);

export async function getProductBySlug(slug: string) {
  const response = await crystallizeApiClient({
    query: productBySlugQuery,
    endpoint: "catalogue",
    variables: { slug },
  });

  return response.data?.catalogue;
}
