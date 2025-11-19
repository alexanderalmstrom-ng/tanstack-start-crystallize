import type { ComponentProps } from "react";
import generateSizesAttribute from "./utils/generateSizesAttribute";
import generateSrcSet from "./utils/generateSrcSet";

// Image size breakpoints from 640px to 2048px with 100vw fallback
const DEFAULT_IMAGE_SIZES = [
  320,
  640,
  768,
  1024,
  1280,
  1536,
  1920,
  2048,
  2560,
  "100vw",
] as const;

// Default fallback size for the img element src attribute
const DEFAULT_SIZE = 1920;

// Default image quality
const DEFAULT_QUALITY = 80;

const DEFAULT_FORMAT = "jpg";

// Default loading behavior for the img element
const DEFAULT_LOADING = "lazy";

type Size = (typeof DEFAULT_IMAGE_SIZES)[number];

export type PictureProps = ComponentProps<"picture"> & {
  src: ComponentProps<"img">["src"];
  mobileSrc?: ComponentProps<"img">["src"];
  alt?: ComponentProps<"img">["alt"];
  loading?: ComponentProps<"img">["loading"];
  quality?: number;
  imageSizes?: readonly (Size | string)[] | string;
  format?: "jpg" | "webp" | "avif";
};

/**
 * A picture component that allows you to display an image with different formats and sizes.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture} - MDN documentation for the picture element
 * @see {@link https://www.contentful.com/developers/docs/references/images-api/} - Contentful's image API documentation
 */

export default function Picture({
  src,
  mobileSrc,
  alt = "",
  loading = DEFAULT_LOADING,
  imageSizes = DEFAULT_IMAGE_SIZES,
  quality = DEFAULT_QUALITY,
  format = DEFAULT_FORMAT,
  ...props
}: PictureProps) {
  return (
    <picture {...props}>
      {mobileSrc && (
        <>
          <PictureSourceElement
            src={mobileSrc}
            format="avif"
            quality={quality}
            imageSizes={imageSizes}
            media="(max-width: 768px)"
          />
          <PictureSourceElement
            src={mobileSrc}
            format="webp"
            quality={quality}
            imageSizes={imageSizes}
            media="(max-width: 768px)"
          />
        </>
      )}
      <PictureSourceElement
        src={src}
        format="avif"
        quality={quality}
        imageSizes={imageSizes}
        media="(min-width: 768px)"
      />
      <PictureSourceElement
        src={src}
        format="webp"
        quality={quality}
        imageSizes={imageSizes}
        media="(min-width: 768px)"
      />
      <PictureImgElement
        src={src}
        alt={alt}
        loading={loading}
        format={format}
        quality={quality}
        imageSizes={imageSizes}
      />
    </picture>
  );
}

function PictureSourceElement({
  src,
  format,
  quality,
  imageSizes,
  media,
  ...props
}: Omit<ComponentProps<"source">, "src"> & {
  src?: PictureProps["src"];
  format?: PictureProps["format"];
  quality?: PictureProps["quality"];
  imageSizes?: PictureProps["imageSizes"];
}) {
  const sizes =
    typeof imageSizes === "string"
      ? imageSizes
      : generateSizesAttribute(imageSizes);
  const type = format === "jpg" ? "image/jpeg" : `image/${format}`;
  const srcSet = generateSrcSet({
    src,
    format,
    imageSizes:
      typeof imageSizes === "string" ? DEFAULT_IMAGE_SIZES : imageSizes,
    quality,
  });

  return (
    <source
      srcSet={srcSet}
      type={type}
      media={media}
      sizes={sizes}
      {...props}
    />
  );
}

function PictureImgElement({
  src,
  alt,
  format,
  quality,
  imageSizes,
  ...props
}: ComponentProps<"img"> & {
  format?: PictureProps["format"];
  quality?: PictureProps["quality"];
  imageSizes?: PictureProps["imageSizes"];
}) {
  const sizes =
    typeof imageSizes === "string"
      ? imageSizes
      : generateSizesAttribute(imageSizes);
  const srcSet = generateSrcSet({
    src,
    format,
    imageSizes: typeof imageSizes === "string" ? [imageSizes] : imageSizes,
    quality,
  });

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="h-full w-full object-cover"
      src={`${src}?w=${DEFAULT_SIZE}?fm=${format}&q=${quality}`}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      {...props}
    />
  );
}
