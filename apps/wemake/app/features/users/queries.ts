import supabase from "~/supabase-client.ts";
import { PRODUCT_SELECT } from "../products/queries.ts";

export const getUserProfile = async (username: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      name,
      username,
      avatar,
      role,
      headline,
      bio
    `)
    .eq("username", username)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getProductsByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      ${PRODUCT_SELECT},
      profiles!products_profile_id_profiles_id_fk!inner (
        id
      )
    `)
    .eq("profiles.username", username)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export const getPostsByUsername = async (username: string) => {
  const { data, error } = await supabase
    .from("community_post_list_view")
    .select()
    .eq("author_username", username)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};
