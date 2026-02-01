import type { SupabaseClient } from "@supabase/supabase-js";
import type { DateTime } from "luxon";
import type { Database } from "~/supabase-client.ts";
import { PAGE_SIZE } from "./constants.ts";

export const PRODUCT_SELECT = `
      id,
      name,
      tagline,
      stats->>upvotes,
      stats->>views,
      stats->>reviews
` as const;

export const getProductsByDateRange = async ({
  supabase,
  startDate,
  endDate,
  limit = PAGE_SIZE,
  page = 1,
}: {
  supabase: SupabaseClient<Database>;
  startDate: DateTime;
  endDate: DateTime;
  limit?: number;
  page?: number;
}) => {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("stats->>upvotes", { ascending: false })
    .gte("created_at", startDate.toISO())
    .lte("created_at", endDate.toISO())
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw error;
  }

  return data;
};

export const getProductPagesByDateRange = async ({
  supabase,
  startDate,
  endDate,
}: {
  supabase: SupabaseClient<Database>;
  startDate: DateTime;
  endDate: DateTime;
}) => {
  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startDate.toISO())
    .lte("created_at", endDate.toISO());

  if (error) {
    throw error;
  }
  if (!count) {
    return 1;
  }

  return Math.ceil(count / PAGE_SIZE);
};

export const getCategories = async ({ supabase }: { supabase: SupabaseClient<Database> }) => {
  const { data, error } = await supabase.from("categories").select("id, name, description");

  if (error) {
    throw error;
  }

  return data;
};

export const getCategoryById = async ({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>;
  id: number;
}) => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, description")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getProductsByCategory = async ({
  supabase,
  id,
  page = 1,
  limit = PAGE_SIZE,
}: {
  supabase: SupabaseClient<Database>;
  id: number;
  page?: number;
  limit?: number;
}) => {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("category_id", id)
    .order("stats->>upvotes", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw error;
  }

  return data;
};

export const getCategoryPages = async ({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>;
  id: number;
}) => {
  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (error) {
    throw error;
  }
  if (!count) {
    return 1;
  }

  return Math.ceil(count / PAGE_SIZE);
};

export const getProductsByKeyword = async ({
  supabase,
  keyword,
  page = 1,
  limit = PAGE_SIZE,
}: {
  supabase: SupabaseClient<Database>;
  keyword: string;
  page?: number;
  limit?: number;
}) => {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .or(`name.ilike.%${keyword}%, tagline.ilike.%${keyword}%`)
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw error;
  }

  return data;
};

export const getPagesByKeyword = async ({
  supabase,
  keyword,
}: {
  supabase: SupabaseClient<Database>;
  keyword: string;
}) => {
  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .or(`name.ilike.%${keyword}%, tagline.ilike.%${keyword}%`);

  if (error) {
    throw error;
  }

  if (!count) {
    return 1;
  }

  return Math.ceil(count / PAGE_SIZE);
};

export const getProductById = async ({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>;
  id: number;
}) => {
  const { data, error } = await supabase
    .from("product_overview_view")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getReviewsByProductId = async ({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>;
  id: number;
}) => {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating,
      comment,
      created_at,
      profiles!inner(name, username, avatar)
    `)
    .eq("product_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};
