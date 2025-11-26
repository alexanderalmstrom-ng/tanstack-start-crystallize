import type { CodegenConfig } from "@graphql-codegen/cli";
import codegenConfig from "./codegen.config.mts";

const config: CodegenConfig = {
  schema: `https://api.crystallize.com/${codegenConfig.tenantId}/discovery`,
  // overwrite: true,
  // allowPartialOutputs: true,
  documents: [
    "src/integrations/server/discovery/**/*.{ts,tsx}",
    "src/integrations/trpc/routers/discovery/**/*.{ts,tsx}",
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
    // "./src/gql/discovery.schema.graphql": {
    //   plugins: ["schema-ast"],
    //   config: {
    //     includeDirectives: true,
    //   },
    // },
  },
};

export default config;
