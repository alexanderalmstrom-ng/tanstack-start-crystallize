import { crystallizeApiClient } from "../client";

export const crystallizeProductBySlugQuery = graphql(`
  query CrystallizeProductBySlug($slug: String!) {
    catalogue(path: $slug, language: "en", pathResolutionMethods: alias) {
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
