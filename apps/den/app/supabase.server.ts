import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { Database } from "./supabase.ts";

export const createSSRClient = (request: Request) => {
  const headers = new Headers();

  const supabase = createServerClient<Database>(
    `https://${import.meta.env.VITE_SUPABASE_ID}.supabase.co`,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      db: {
        schema: __APP_NAME__,
      },
      cookieOptions: {
        domain: import.meta.env.VITE_COOKIE_DOMAIN ?? ".lvh.me",
        path: "/",
        sameSite: "lax",
        secure: import.meta.env.PROD,
      },
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "") as {
            name: string;
            value: string;
          }[];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, {
                ...options,
                domain: import.meta.env.VITE_COOKIE_DOMAIN ?? ".lvh.me",
                path: "/",
                sameSite: "lax",
                secure: import.meta.env.PROD,
              }),
            );
          });
        },
      },
    },
  );

  return { supabase, headers };
};
