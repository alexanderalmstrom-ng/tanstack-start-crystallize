import type { ComponentProps } from "react";

type AddToCartButtonProps = ComponentProps<"button"> & {
  variantId: string;
};

export default function ProductFormAddToCartButton({
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
