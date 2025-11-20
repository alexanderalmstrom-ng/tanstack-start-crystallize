import { addToCartServerFn } from "@/lib/cart";
import AddToCartButton from "./ProductFormAddToCartButton";

export default function ProductForm({ variantId }: { variantId: string }) {
  return (
    <form method="post" action={addToCartServerFn.url}>
      <input name="variantId" type="hidden" value={variantId} />
      <input name="quantity" type="number" value={1} />
      <AddToCartButton variantId={variantId}>Add to cart</AddToCartButton>
    </form>
  );
}
