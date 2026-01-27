import { redirect } from "react-router";
import z from "zod";
import supabase from "~/supabase-client.ts";
import type { Route } from "./+types/product-visit-page";

const paramsSchema = z.object({
  productId: z.coerce.number(),
});

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { success, data: dataParams } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid product ID");
  }

  const { data, error } = await supabase
    .from("products")
    .select("url")
    .eq("id", dataParams.productId)
    .single();

  if (error) {
    throw error;
  }

  await supabase.rpc("track_event", {
    event_type: "product_visit",
    event_data: { product_id: dataParams.productId },
  });

  return redirect(data.url);
};
