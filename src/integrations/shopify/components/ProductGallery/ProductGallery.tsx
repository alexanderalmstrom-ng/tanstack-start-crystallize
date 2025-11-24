import { Image } from "@unpic/react";
import { Fragment } from "react/jsx-runtime";
import type { MediaImageFragment } from "@/gql/graphql";

export default function ProductGallery({
  images,
}: {
  images: (MediaImageFragment | undefined)[] | undefined;
}) {
  return (
    <Fragment>
      {images?.map(
        (image) =>
          image?.image?.url && (
            <picture
              className="bg-secondary lg:col-span-6 xl:col-span-7"
              key={image.id}
            >
              <Image
                src={image.image.url}
                alt={image.image.altText ?? ""}
                width={image.image.width ?? 2000}
                height={image.image.height ?? 2000}
                className="w-full h-full object-contain mix-blend-multiply aspect-square"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="eager"
              />
            </picture>
          ),
      )}
    </Fragment>
  );
}
