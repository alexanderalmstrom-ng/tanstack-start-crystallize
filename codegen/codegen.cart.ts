import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "cart-token": {
        loader: "./codegen/cart.mjs",
      },
    },
  ],
  // overwrite: true,
  // allowPartialOutputs: true,
  documents: [
    "src/integrations/server/cart/**/*.{ts,tsx}",
    "src/integrations/trpc/routers/cart/**/*.{ts,tsx}",
    "!src/gql/**/*",
  ],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/cart/": {
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
    // "./src/gql/catalogue.schema.graphql": {
    //   plugins: ["schema-ast"],
    //   config: {
    //     includeDirectives: true,
    //   },
    // },
  },
};

export default config;
