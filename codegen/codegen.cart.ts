import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      "auth-token": {
        loader: "./codegen/cart.loader.mjs",
      },
    },
  ],
  documents: [
    "src/lib/cart/**/*.{ts,tsx}",
    "src/integrations/trpc/routers/cart/**/*.{ts,tsx}",
    "!src/gql/**/*",
  ],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/cart/": {
      preset: "client",
      presetConfig: {
        fragmentMasking: { unmaskFunctionName: "getFragmentData" },
      },
      config: {
        documentMode: "string",
        useTypeImports: true,
      },
    },
  },
};

export default config;
