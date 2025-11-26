import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import NotFound from "./components/NotFound/NotFound";
import * as TanstackQueryRootProvider from "./integrations/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const providerContext = TanstackQueryRootProvider.getProviderContext();

  const router = createRouter({
    routeTree,
    context: { ...providerContext },
    defaultPreload: "intent",
    scrollRestoration: true,
    scrollRestorationBehavior: "instant",
    notFoundMode: "root",
    defaultNotFoundComponent: () => <NotFound />,
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQueryRootProvider.Provider {...providerContext}>
          {props.children}
        </TanstackQueryRootProvider.Provider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: providerContext.queryClient,
  });

  return router;
};
