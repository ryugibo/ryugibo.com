import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";

export const createSSRClient = (request: Request, env: Record<string, string>) => {
  const headers = new Headers();

  const supabase = createServerClient<Database, "snipt">(
    `https://${env.VITE_SUPABASE_ID}.supabase.co`,
    env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      db: {
        schema: "snipt",
      },
      cookieOptions: {
        domain: env.VITE_COOKIE_DOMAIN ?? ".lvh.me",
        path: "/",
        sameSite: "lax",
        secure: env.PROD === "true",
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
                domain: env.VITE_COOKIE_DOMAIN ?? ".lvh.me",
                path: "/",
                sameSite: "lax",
                secure: env.PROD === "true",
              }),
            );
          });
        },
      },
    },
  );

  return { supabase, headers };
};
