import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./supabase.ts";

export const supabase = createBrowserClient<Database>(
  `https://${import.meta.env.VITE_SUPABASE_ID}.supabase.co`,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
  {
    db: {
      schema: "den",
    },
    cookieOptions: {
      domain: import.meta.env.VITE_COOKIE_DOMAIN ?? ".lvh.me",
      path: "/",
      sameSite: "lax",
      secure: import.meta.env.PROD,
    },
  },
);
