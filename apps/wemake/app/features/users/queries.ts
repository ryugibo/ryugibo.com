import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "react-router";
import type { Database } from "~/supabase-client.ts";
import { PRODUCT_SELECT } from "../products/queries.ts";

export const getProfileByUsername = async ({
  supabase,
  username,
}: {
  supabase: SupabaseClient<Database>;
  username: string;
}) => {
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
export const getProfileById = async ({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>;
  id: string;
}) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      name,
      username,
      avatar
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getProductsByUsername = async ({
  supabase,
  username,
}: {
  supabase: SupabaseClient<Database>;
  username: string;
}) => {
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

export const getProductsByProfileId = async ({
  supabase,
  profile_id,
}: {
  supabase: SupabaseClient<Database>;
  profile_id: string;
}) => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name
    `)
    .eq("profile_id", profile_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};

export const getPostsByUsername = async ({
  supabase,
  username,
}: {
  supabase: SupabaseClient<Database>;
  username: string;
}) => {
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

export async function getLoggedInProfileId({ supabase }: { supabase: SupabaseClient<Database> }) {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return data.user.id;
}

export async function ensureLoggedInProfileId({
  supabase,
  redirect_path,
}: {
  supabase: SupabaseClient<Database>;
  redirect_path: string;
}) {
  const profile_id = await getLoggedInProfileId({ supabase });
  if (profile_id) {
    return profile_id;
  }
  throw redirect(redirect_path);
}

export const getDashboardStats = async ({
  supabase,
  profile_id,
}: {
  supabase: SupabaseClient<Database>;
  profile_id: string;
}) => {
  const { error, data } = await supabase.rpc("get_dashboard_stats", { profile_id });

  if (error) {
    throw error;
  }

  return { stats: data };
};

export const getProductStats = async ({
  supabase,
  product_id,
}: {
  supabase: SupabaseClient<Database>;
  product_id: string;
}) => {
  const { error, data } = await supabase.rpc("get_product_stats", { product_id });

  if (error) {
    throw error;
  }

  return { stats: data };
};
