import type { CodegenConfig } from '@graphql-codegen/cli'
import z from 'zod'

const SHOPIFY_SHOP_NAME = z.string().min(1, "SHOPIFY_STORE_NAME is required").parse(process.env.SHOPIFY_SHOP_NAME)
const SHOPIFY_ACCESS_TOKEN = z.string().min(1, "SHOPIFY_STORE_PRIVATE_TOKEN is required").parse(process.env.SHOPIFY_ACCESS_TOKEN)
 
const config: CodegenConfig = {
  schema: [
    {
      [`https://${SHOPIFY_SHOP_NAME}.myshopify.com/api/2025-10/graphql.json`]:
        {
          headers: {
            "Shopify-Storefront-Private-Token": SHOPIFY_ACCESS_TOKEN,
          },
        },
    },
  ],
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client'
    }
  }
}
 
export default config