import { Image } from "@unpic/react";
import { useShopifySessionContext } from "@/integrations/shopify/session/session.context";

export default function Cart() {
  const { cart, cartIsLoading } = useShopifySessionContext();

  if (cartIsLoading) {
    return <div>Loading cart...</div>;
  }

  if (!cart) {
    return <div>No cart found</div>;
  }

  return (
    <div>
      <p>Cart ID: {cart?.id}</p>
      {cart?.lines.edges.map((line) => (
        <div key={line.node.id} className="grid grid-cols-[auto_1fr] gap-2">
          {line.node.merchandise.product.featuredImage?.url && (
            <Image
              className="w-16 h-16 object-contain aspect-square"
              src={line.node.merchandise.product.featuredImage.url}
              alt={line.node.merchandise.product.featuredImage.altText ?? ""}
              width={line.node.merchandise.product.featuredImage.width ?? 128}
              height={line.node.merchandise.product.featuredImage.height ?? 128}
              loading="lazy"
              sizes="64px"
            />
          )}
          <div>
            <h3>{line.node.merchandise.product.title}</h3>
            <p>Quantity: {line.node.quantity}</p>
            <p>
              Price: {line.node.cost.amountPerQuantity.amount}{" "}
              {line.node.cost.amountPerQuantity.currencyCode}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
