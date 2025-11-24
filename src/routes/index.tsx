import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return <Fragment>Home</Fragment>;
}
