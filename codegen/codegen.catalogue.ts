import type { CodegenConfig } from "@graphql-codegen/cli";
import codegenConfig from "./codegen.config.mts";

const config: CodegenConfig = {
  schema: [
    {
      [`https://api.crystallize.com/${codegenConfig.tenantId}/catalogue`]: {
        headers: {
          "X-Crystallize-Access-Token-Id": codegenConfig.accessTokenId,
          "X-Crystallize-Access-Token-Secret": codegenConfig.accessTokenSecret,
        },
      },
    },
  ],
  documents: [
    "src/lib/catalogue/**/*.{ts,tsx}",
    "src/integrations/trpc/routers/catalogue/**/*.{ts,tsx}",
    "!src/gql/**/*",
  ],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/gql/catalogue/": {
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
