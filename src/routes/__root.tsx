import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import Cart from "@/components/Cart/Cart";
import type { TRPCRouter } from "@/integrations/trpc/router";
import SiteHeader from "../components/SiteHeader";
import { ShopifySessionProvider } from "../integrations/shopify/session/session.context";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles/globals.css?url";

export interface RouterAppContext {
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<TRPCRouter>;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Shopify",
        description: "A Shopify storefront built with TanStack Start",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <ShopifySessionProvider>
          <SiteHeader />
          <main className="grow">
            {children}
            <Cart />
          </main>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </ShopifySessionProvider>
        <Scripts />
      </body>
    </html>
  );
}
