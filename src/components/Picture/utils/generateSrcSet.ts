import type { PictureProps } from "../Picture";

type GenerateSrcSetOptions = {
  src?: PictureProps["src"];
  format?: PictureProps["format"];
  quality?: PictureProps["quality"];
  imageSizes?: readonly (number | string)[];
};

/**
 * Generates srcSet string for a given image format
 */
export default function generateSrcSet({
  src,
  format,
  imageSizes,
  quality,
}: GenerateSrcSetOptions) {
  if (!src || !imageSizes?.length) {
    return undefined;
  }

  return imageSizes
    .filter((imageSize): imageSize is number => typeof imageSize === "number")
    .map(
      (imageSize) =>
        `${src}?w=${imageSize}&fm=${format}&q=${quality} ${imageSize}w`,
    )
    .join(", ");
}
