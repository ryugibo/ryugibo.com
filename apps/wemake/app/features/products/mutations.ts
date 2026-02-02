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

export const createProduct = async ({
  supabase,
  data,
}: {
  supabase: SupabaseClient<Database>;
  data: {
    name: string;
    tagline: string;
    description: string;
    how_it_works: string;
    icon: string;
    url: string;
    profile_id: string;
    category_id: number;
  };
}) => {
  const { data: product, error } = await supabase
    .from("products")
    .insert(data)
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  return product;
};
