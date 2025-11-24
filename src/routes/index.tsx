import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import ProductList from "@/components/shopify/ProductList/ProductList";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <Fragment>
      <ProductList />
    </Fragment>
  );
}
