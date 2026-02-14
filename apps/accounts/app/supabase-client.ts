import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";

export const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  {
    cookieOptions: {
      domain: import.meta.env.VITE_COOKIE_DOMAIN ?? ".lvh.me",
      path: "/",
      sameSite: "lax",
      secure: import.meta.env.PROD,
    },
  },
);

export const createSSRClient = (request: Request) => {
  const headers = new Headers();

  const supabase = createServerClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
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
