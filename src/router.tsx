import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const providerContext = TanstackQuery.getProviderContext();

  const router = createRouter({
    routeTree,
    context: { ...providerContext },
    defaultPreload: "intent",
    scrollRestoration: true,
    scrollRestorationBehavior: "instant",
    defaultNotFoundComponent: NotFoundComponent,
    notFoundMode: "root",
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider {...providerContext}>
          {props.children}
        </TanstackQuery.Provider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: providerContext.queryClient,
  });

  return router;
};

function NotFoundComponent() {
  return <div>Not Found</div>;
}
