import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "~/app.css";
import { cn } from "@ryugibo/ui";
import { Settings } from "luxon";
import Navigation from "~/common/components/navigation.tsx";
import { getUserById } from "./features/users/queries.ts";
import { createSSRClient } from "./supabase-client.ts";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  Settings.defaultLocale = "ko";
  Settings.defaultZone = "Asia/Seoul";

  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main>{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { origin } = url;
  const { supabase } = createSSRClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { user: null, profile: null, origin };
  }
  const profile = await getUserById(supabase, { id: user.id });
  return { user, profile, origin };
};

export default function App({ loaderData }: Route.ComponentProps) {
  const { pathname } = useLocation();
  const isLoggedIn = loaderData.user !== null;

  return (
    <div className={cn(!pathname.startsWith("/auth") && "py-28 px-5 lg:px-20")}>
      {!pathname.startsWith("/auth") && (
        <Navigation
          origin={origin}
          isLoggedIn={isLoggedIn}
          name={loaderData.profile?.name}
          username={loaderData.profile?.username}
          avatar={loaderData.profile?.avatar}
          hasNotifications={true}
          hasMessages={true}
        />
      )}
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
