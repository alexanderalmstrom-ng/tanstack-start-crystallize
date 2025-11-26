import { type FragmentType, getFragmentData } from "@/gql/discovery";
import { imageFragment } from "../fragments/image";

export function resolveImagesFragment(
  images: (FragmentType<typeof imageFragment> | null | undefined)[] | undefined,
) {
  if (!images) return undefined;

  return images
    .filter((image) => image !== null && image !== undefined)
    .map((image) => getFragmentData(imageFragment, image))
    .filter((image) => image?.url);
}
