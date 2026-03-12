import { defineMiddleware } from "astro:middleware";
import { eq } from "@ryugibo/db";
import { resolveAppUrl } from "@ryugibo/utils";
import { profiles } from "./db/schema.ts";
import { getDb } from "./lib/db.server.ts";
import { createSSRClient } from "./lib/supabase.server.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request, locals, redirect } = context;
  const env = import.meta.env;

  const { supabase, headers } = createSSRClient(request, env);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (url.pathname === "/api/health") {
    return next();
  }

  if (!user) {
    // If not logged in, send them to accounts app
    const accountsUrl = resolveAppUrl("accounts");

    return redirect(`${accountsUrl}/login?redirect_to=${url.href}`, 302);
  }

  // Set user on locals for Astro pages
  locals.user = user;
  locals.supabase = supabase;

  // DB connection to check profile existence
  const db = getDb(env);

  const [sniptProfile] = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);

  locals.profile = sniptProfile ?? null;

  // Enforce profile creation
  if (!sniptProfile && url.pathname !== "/make-profile" && !url.pathname.startsWith("/api/")) {
    return redirect("/make-profile", 302);
  }

  if (sniptProfile && url.pathname === "/make-profile") {
    return redirect("/", 302);
  }

  const response = await next();

  // Attach session cookies if refreshed
  headers.forEach((value, key) => {
    if (key === "Set-Cookie") {
      response.headers.append(key, value);
    } else {
      response.headers.set(key, value);
    }
  });

  return response;
});
