import { redirect } from "react-router";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/logout-page";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers } = createSSRClient(request);
  await supabase.auth.signOut();

  const url = new URL(request.url);
  const redirectUrl = url.searchParams.get("redirect_url") || "/";

  return redirect(redirectUrl, { headers });
};
