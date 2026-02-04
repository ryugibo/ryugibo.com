import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database as SupabaseDatabase } from "database.types";
import type { MergeDeep, SetNonNullable } from "type-fest";

export type Database = MergeDeep<
  SupabaseDatabase,
  {
    den: {
      Views: {
        profile_books_list_view: {
          Row: SetNonNullable<SupabaseDatabase["den"]["Views"]["profile_books_list_view"]["Row"]>;
        };
      };
    };
  }
>;

export const supabase = createBrowserClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
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
  },
);

export const createSSRClient = (request: Request) => {
  const headers = new Headers();

  const supabase = createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      db: {
        schema: __APP_NAME__,
      },
      cookieOptions: {
        domain: ".lvh.me",
        path: "/",
        sameSite: "lax",
        httpOnly: false,
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

  return { supabase, headers };
};

export const supabaseAdmin = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SECRET_DEFAULT_KEY || "",
  {
    db: {
      schema: __APP_NAME__,
    },
  },
);
