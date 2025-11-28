import { Image, type ImageProps } from "@unpic/react";
import { cn } from "@/lib/utils";

export default function ProductSwatchImage({
  className,
  ...props
}: ImageProps) {
  return (
    <Image
      className={cn(
        "size-6 object-cover aspect-square mix-blend-multiply",
        className,
      )}
      {...props}
    />
  );
}
