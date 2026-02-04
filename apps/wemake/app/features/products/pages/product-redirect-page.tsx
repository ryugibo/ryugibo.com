import { redirect } from "react-router";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/product-redirect-page";

export const loader = ({ params, request }: Route.LoaderArgs) => {
  const { headers } = createSSRClient(request);
  return redirect(`/products/${params.id}/overview`, { headers });
};
