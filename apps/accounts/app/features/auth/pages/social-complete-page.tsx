import { redirect } from "react-router";
import z from "zod";
import { OAUTH_PROVIDERS } from "~/features/auth/constants.ts";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/social-complete-page";

const paramsSchema = z.object({
  provider: z.enum(OAUTH_PROVIDERS),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success } = paramsSchema.safeParse(params);
  if (!success) {
    return redirect("/login");
  }
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return redirect("/login");
  }
  const redirectUrl = url.searchParams.get("redirect_url") || "/";
  const { supabase, headers } = createSSRClient(request);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    throw error;
  }
  return redirect(redirectUrl, { headers });
};
