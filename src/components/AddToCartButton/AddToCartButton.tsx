import { createServerFn } from "@tanstack/react-start";
import type { ComponentProps } from "react";
import z from "zod";
import { createCartServerFn } from "@/lib/cart";

export const addToCartServerFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Invalid form data");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const variantId = z.string().safeParse(data.get("variantId"));
    const quantity = z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : undefined))
      .safeParse(data.get("quantity"));

    if (variantId.error) {
      throw new Error("Variant ID is required", {
        cause: variantId.error.cause,
      });
    }

    try {
      await createCartServerFn({
        data: {
          lines: [{ quantity: quantity.data, merchandiseId: variantId.data }],
        },
      });

      return "Cart created successfully";
    } catch (error) {
      console.error("Error adding to cart", error);
      return "There was an error adding to cart";
    }
  });

type AddToCartButtonProps = ComponentProps<"button"> & {
  variantId: string;
};

export default function AddToCartButton({
  children,
  variantId,
  ...props
}: AddToCartButtonProps) {
  return (
    <button
      type="submit"
      className="bg-primary text-primary-foreground px-6 py-3 w-full"
      {...props}
    >
      {children}
    </button>
  );
}
