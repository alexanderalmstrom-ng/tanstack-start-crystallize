import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { AddToCartSchema, addToCartServerFn } from "@/lib/cart.server";
import AddToCartButton from "./ProductFormAddToCartButton";

export default function ProductForm({ variantId }: { variantId: string }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState, control } = useForm({
    resolver: zodResolver(AddToCartSchema),
    defaultValues: {
      variantId,
      quantity: 1,
    },
  });
  const { mutate: addToCartMutation } = useMutation({
    mutationFn: addToCartServerFn,
    onError: (error) => {
      console.error("ProductForm.onError: ", error);
    },
    onSuccess: (data) => {
      console.log("ProductForm.onSuccess: Cart updated", data?.id);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await addToCartMutation({
      data: {
        variantId: data.variantId,
        quantity: data.quantity,
      },
    });
  });

  return (
    <form method="post" onSubmit={onSubmit}>
      <input type="hidden" {...register("variantId")} />
      <Controller
        control={control}
        name="quantity"
        render={({ field }) => (
          <input
            {...field}
            type="number"
            onChange={(event) => field.onChange(event.target.valueAsNumber)}
          />
        )}
      />
      <AddToCartButton variantId={variantId} disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Adding to cart..." : "Add to cart"}
      </AddToCartButton>
      {formState.errors && (
        <div className="text-red-500">{formState.errors.quantity?.message}</div>
      )}
    </form>
  );
}
