import type { PictureProps } from "../Picture";

/**
 * Generates sizes attribute based on the image sizes array
 * Supports both numbers (converted to px) and strings (used as-is)
 * The last item in the array is used as the fallback size
 */
export default function generateSizesAttribute(
  sizes?: PictureProps["imageSizes"],
) {
  if (typeof sizes === "string") {
    return sizes;
  }

  if (!sizes) {
    return undefined;
  }

  // The last item is always used as the fallback
  const lastItem = sizes[sizes.length - 1];
  const fallback = typeof lastItem === "string" ? lastItem : `100vw`;

  const mediaQueries = sizes.map((size) => {
    const sizeValue = typeof size === "number" ? `${size}px` : size;
    const breakpoint = typeof size === "number" ? size : parseInt(size, 10);

    return `(max-width: ${breakpoint}px) ${sizeValue}`;
  });

  return [...mediaQueries, fallback].join(", ");
}
