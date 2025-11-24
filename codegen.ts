import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      [`https://api.crystallize.com/${getCrystallizeTenantId()}/catalogue`]:
        {
          headers: {
            "X-Crystallize-Access-Token-Id": getCrystallizeAccessTokenId(),
            "X-Crystallize-Access-Token-Secret": getCrystallizeAccessTokenSecret(),
          },
        },
    },
  ],
  documents: ["src/**/*.{ts,tsx}", "!src/gql/**/*"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: "getFragmentData" },
      },
      config: {
        documentMode: "string",
        useTypeImports: true,
      },
    },
    "./schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true,
      },
    },
  },
};

function getCrystallizeTenantId() {
  if (process.env.CRYSTALLIZE_TENANT_IDENTIFIER) {
    return process.env.CRYSTALLIZE_TENANT_IDENTIFIER;
  }

  throw new Error("No Crystallize tenant identifier found");
}

function getCrystallizeAccessTokenId() {
  if (process.env.CRYSTALLIZE_ACCESS_TOKEN_ID) {
    return process.env.CRYSTALLIZE_ACCESS_TOKEN_ID;
  }

  throw new Error("No Crystallize access token ID found");
}

function getCrystallizeAccessTokenSecret() {
  if (process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET) {
    return process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET;
  }

  throw new Error("No Crystallize access token secret found");
}

export default config;
