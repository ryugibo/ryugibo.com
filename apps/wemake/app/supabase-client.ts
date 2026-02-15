import {
  createBrowserClient,
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { createClient, type User } from "@supabase/supabase-js";
import type { Database as SupabaseDatabase } from "database.types";
import type { MergeDeep, SetFieldType, SetNonNullable } from "type-fest";

export type Database = MergeDeep<
  SupabaseDatabase,
  {
    wemake: {
      Views: {
        community_post_list_view: {
          Row: SetFieldType<
            SetNonNullable<SupabaseDatabase["wemake"]["Views"]["community_post_list_view"]["Row"]>,
            "author_avatar",
            string | null
          >;
        };
        product_overview_view: {
          Row: SetNonNullable<SupabaseDatabase["wemake"]["Views"]["product_overview_view"]["Row"]>;
        };
        ideas_view: {
          Row: SetNonNullable<SupabaseDatabase["wemake"]["Views"]["ideas_view"]["Row"]>;
        };
        community_post_detail_view: {
          Row: SetFieldType<
            SetNonNullable<
              SupabaseDatabase["wemake"]["Views"]["community_post_detail_view"]["Row"]
            >,
            "author_avatar",
            string | null
          >;
        };
      };
    };
  }
>;

export const supabase = createBrowserClient<Database>(
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
  },
);

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

export const supabaseAdmin = createClient<Database>(
  `https://${import.meta.env.VITE_SUPABASE_ID}.supabase.co`,
  process.env.SUPABASE_SECRET_DEFAULT_KEY || "",
  {
    db: {
      schema: __APP_NAME__,
    },
  },
);
