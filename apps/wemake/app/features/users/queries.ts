import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "react-router";
import type { Database } from "~/supabase-client.ts";
import { PRODUCT_SELECT } from "../products/queries.ts";

export const getProfileByUsername = async (
  supabase: SupabaseClient<Database>,
  { username }: { username: string },
) => {
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
export const getProfileById = async (
  supabase: SupabaseClient<Database>,
  { id }: { id: string },
) => {
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

export const getProductsByUsername = async (
  supabase: SupabaseClient<Database>,
  { username }: { username: string },
) => {
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

export const getPostsByUsername = async (
  supabase: SupabaseClient<Database>,
  { username }: { username: string },
) => {
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

type PositiveInteger<N extends number> = `${N}` extends `-${string}` | "0" ? never : N;

export const ensureLoggedInProfileId = async <T extends number>(
  supabase: SupabaseClient<Database>,
  { pathname, steps }: { pathname: string; steps: T & PositiveInteger<T> },
) => {
  const { data, error } = await supabase.auth.getUser();

  if (!error) {
    return data.user.id;
  }
  const segments = pathname.split("/").filter(Boolean);
  const parentSegments = steps >= segments.length ? [] : segments.slice(0, -steps);
  throw redirect(`/${parentSegments.join("/")}`);
};
