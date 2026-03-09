import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  `https://${import.meta.env.VITE_SUPABASE_ID}.supabase.co`,
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
