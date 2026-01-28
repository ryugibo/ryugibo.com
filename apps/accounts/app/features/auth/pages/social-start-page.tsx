import { redirect } from "react-router";
import z from "zod";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/social-start-page";

const paramsSchema = z.object({
  provider: z.enum(["github"]),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    return redirect("/login");
  }
  const { provider } = data;
  const requestUrl = new URL(request.url);
  const redirectUrl = requestUrl.searchParams.get("redirect_url");
  const redirectTo = new URL(`${requestUrl.origin}/social/${provider}/complete`);
  if (redirectUrl) {
    redirectTo.searchParams.set("redirect_url", redirectUrl);
  }
  const { supabase, headers } = createSSRClient(request);
  const {
    data: { url },
    error,
  } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: redirectTo.toString() },
  });
  if (error) {
    throw error;
  }
  if (!url) {
    return redirect("/login");
  }
  return redirect(url, { headers });
};
