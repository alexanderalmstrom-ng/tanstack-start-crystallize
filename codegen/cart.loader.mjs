import { buildClientSchema, getIntrospectionQuery } from "graphql";
import codegenConfig from "./codegen.config.mts";

export default async () => {
  const introspectionQuery = getIntrospectionQuery();

  const cartTokenResponse = await fetch(
    `https://shop-api.crystallize.com/${codegenConfig.tenantId}/auth/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Crystallize-Access-Token-Id": codegenConfig.accessTokenId,
        "X-Crystallize-Access-Token-Secret": codegenConfig.accessTokenSecret,
      },
      body: JSON.stringify({
        scopes: ["cart", "cart:admin"],
        expiresIn: 18000, // 5 hours
      }),
    },
  );

  const cartTokenData = await cartTokenResponse.json();

  const cartResponse = await fetch(
    `https://shop-api.crystallize.com/${codegenConfig.tenantId}/cart`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Crystallize-Access-Token-Id": codegenConfig.accessTokenId,
        "X-Crystallize-Access-Token-Secret": codegenConfig.accessTokenSecret,
        Authorization: `Bearer ${cartTokenData.token}`,
      },
      body: JSON.stringify({
        query: introspectionQuery,
      }),
    },
  );

  const cartData = await cartResponse.json();

  return buildClientSchema(cartData.data);
};
