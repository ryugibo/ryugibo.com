import { redirect } from "react-router";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/logout-page";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers } = createSSRClient(request);
  await supabase.auth.signOut();
  return redirect("/", { headers });
};
