import { type FragmentType, getFragmentData } from "@/gql/discovery";
import { imageFragment } from "@/integrations/crystallize/discovery/fragments/image";

export default function ProductGallery({
  images,
}: {
  images: (FragmentType<typeof imageFragment> | null | undefined)[] | undefined;
}) {
  if (!images) return null;

  const imagesWithUrl = images
    .map((image) => getFragmentData(imageFragment, image))
    .filter((image) => image?.url);

  return (
    <div className="bg-secondary no-scrollbar flex snap-x snap-mandatory flex-row flex-nowrap overflow-x-auto overflow-y-hidden">
      {imagesWithUrl.map((image) => {
        if (!image?.url) return null;

        return (
          <picture key={image.url} className="shrink-0 basis-full snap-start">
            <img
              className="w-full h-full object-cover aspect-square mix-blend-multiply"
              src={image.url}
              width={image.width ?? undefined}
              height={image.height ?? undefined}
              alt={image.altText ?? ""}
            />
          </picture>
        );
      })}
    </div>
  );
}
