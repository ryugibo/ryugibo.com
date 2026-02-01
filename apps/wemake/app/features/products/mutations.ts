import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase-client.ts";

export const createReview = async ({
  supabase,
  rating,
  comment,
  profile_id,
  product_id,
}: {
  supabase: SupabaseClient<Database>;
  rating: number;
  comment: string;
  profile_id: string;
  product_id: number;
}) => {
  const { data, error } = await supabase
    .from("reviews")
    .insert({ rating, comment, profile_id, product_id })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};
