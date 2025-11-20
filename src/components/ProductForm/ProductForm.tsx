import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { addToCartServerFn } from "@/lib/cart";
import AddToCartButton from "./ProductFormAddToCartButton";

export const addToCartSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().optional().default(1),
});

export default function ProductForm({ variantId }: { variantId: string }) {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(addToCartSchema),
    defaultValues: {
      variantId,
      quantity: 1,
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    const response = await addToCartServerFn({
      data: {
        variantId: data.variantId,
        quantity: data.quantity,
      },
    });

    console.log(response);
  });

  return (
    <form method="post" onSubmit={onSubmit}>
      <input type="hidden" {...register("variantId")} />
      <input type="number" {...register("quantity")} />
      <AddToCartButton variantId={variantId} disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Adding to cart..." : "Add to cart"}
      </AddToCartButton>
    </form>
  );
}
