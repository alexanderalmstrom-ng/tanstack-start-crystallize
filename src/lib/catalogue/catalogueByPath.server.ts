import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { crystallizeCatalogue } from "@/integrations/crystallize/client";
import { normalizeSlug } from "@/lib/utils";
import { catalogueByPathQuery } from "./catalogueByPath.query";

export const getCatalogueByPathServerFn = createServerFn({ method: "GET" })
  .inputValidator(z.object({ path: z.string().default("/") }))
  .handler(async ({ data: { path } }) => {
    const response = await crystallizeCatalogue({
      variables: { path: normalizeSlug(path) },
      query: catalogueByPathQuery,
    });

    return response.data?.catalogue;
  });
