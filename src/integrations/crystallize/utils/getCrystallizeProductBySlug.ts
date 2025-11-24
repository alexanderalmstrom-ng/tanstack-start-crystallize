import { graphql } from "@/gql";
import { crystallizeApiClient } from "../client";

const crystallizeProductBySlugQuery = graphql(`
  query CrystallizeProductBySlug($slug: String!) {
    catalogue(path: $slug) {
      id
      name
    }
  }
`);

export async function getCrystallizeProductBySlug(slug: string) {
  return await crystallizeApiClient({
    query: crystallizeProductBySlugQuery,
    endpoint: "catalogue",
    variables: { slug },
  });
}
