import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      [`https://api.crystallize.com/${getCrystallizeTenantId()}/discovery`]: {},
    },
  ],
  // overwrite: true,
  // allowPartialOutputs: true,
  documents: [
    "src/integrations/crystallize/discovery/**/*.{ts,tsx}",
    "src/integrations/trpc/routers/discovery.ts",
    "!src/gql/**/*",
  ],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/discovery/": {
      // plugins: ["typescript"],
      preset: "client",
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: "getFragmentData" },
      },
      config: {
        documentMode: "string",
        useTypeImports: true,
      },
    },
    "./discovery.schema.graphql": {
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

export default config;
