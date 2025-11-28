import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductFragment } from "@/gql/discovery/graphql";
import { addToCartServerFn } from "@/lib/cart/addToCart.server";
import { resolveImagesFragment } from "@/lib/images";
import { getVariantsWithSkuAndName } from "@/lib/variants";
import ProductSwatchImage from "./ProductSwatchImage";

const productFormSchema = z.object({
  variant: z.string().min(1),
});

export default function ProductForm({ product }: { product: ProductFragment }) {
  const variants = getVariantsWithSkuAndName(product?.variants);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      variant: variants?.[0]?.sku ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof productFormSchema>) => {
    console.log("onSubmit data", data);

    const addToCartResponse = await addToCartServerFn({
      data: {
        items: [{ sku: data.variant, quantity: 1 }],
      },
    });

    console.log("addToCartResponse", addToCartResponse);
  };

  if (!variants || variants.length === 0) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="variant"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Variant</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {variants.map((variant) => {
                        const variantImages = resolveImagesFragment(
                          variant.images,
                        );
                        return (
                          <SelectItem key={variant.sku} value={variant.sku}>
                            {variantImages?.[0]?.url && (
                              <ProductSwatchImage
                                src={variantImages?.[0]?.url}
                                width={variantImages?.[0]?.width ?? 100}
                                height={variantImages?.[0]?.height ?? 100}
                                alt={variantImages?.[0]?.altText ?? ""}
                                sizes="100px"
                              />
                            )}
                            {variant.name}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add to cart</Button>
      </form>
    </Form>
  );
}
