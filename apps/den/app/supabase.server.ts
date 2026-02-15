import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import type { Database } from "./supabase.ts";

let cachedUserPromise: Promise<User | null> | null = null;

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
        domain: ".lvh.me",
        path: "/",
        sameSite: "lax",
        secure: false,
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
                domain: ".lvh.me",
                path: "/",
                sameSite: "lax",
                secure: false,
              }),
            );
          });
        },
      },
    },
  );

  function getAuthUser() {
    if (!cachedUserPromise) {
      cachedUserPromise = (async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.log(error);
        }
        return data.user;
      })();
    }
    return cachedUserPromise;
  }

  return { supabase, headers, getAuthUser };
};
