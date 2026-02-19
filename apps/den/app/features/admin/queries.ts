import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase.ts";

export const getPendingRequests = async ({ supabase }: { supabase: SupabaseClient<Database> }) => {
  const { data, error } = await supabase
    .from("book_grouping_requests")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getBooksByIsbns = async ({
  supabase,
  isbns,
}: {
  supabase: SupabaseClient<Database>;
  isbns: string[];
}) => {
  if (isbns.length === 0) return [];
  const { data, error } = await supabase.from("books").select("isbn, title").in("isbn", isbns);

  if (error) throw error;
  return data;
};

export const getBookByIsbn = async ({
  supabase,
  isbn,
}: {
  supabase: SupabaseClient<Database>;
  isbn: string;
}) => {
  const { data, error } = await supabase
    .from("books")
    .select("work_id, title")
    .eq("isbn", isbn)
    .single();

  if (error && error.code !== "PGRST116") throw error; // Allow not found
  return data;
};

export const getAllWorks = async ({ supabase }: { supabase: SupabaseClient<Database> }) => {
  const { data, error } = await supabase.from("works").select("id, title").order("title");

  if (error) throw error;
  return data;
};

export const getAllSeries = async ({ supabase }: { supabase: SupabaseClient<Database> }) => {
  const { data, error } = await supabase.from("series").select("id, title").order("title");

  if (error) throw error;
  return data;
};

export const getSeriesWithCount = async ({
  supabase,
  page,
  pageSize,
  q,
}: {
  supabase: SupabaseClient<Database>;
  page: number;
  pageSize: number;
  q?: string;
}) => {
  let query = supabase.from("series").select("id, title", { count: "exact" }).order("title");

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data, count, error } = await query.range((page - 1) * pageSize, page * pageSize - 1);

  if (error) throw error;
  return { data, count };
};

export const getWorksBySeriesIds = async ({
  supabase,
  seriesIds,
}: {
  supabase: SupabaseClient<Database>;
  seriesIds: string[];
}) => {
  if (seriesIds.length === 0) return [];
  const { data, error } = await supabase
    .from("works")
    .select("id, title, series_id, series_order")
    .in("series_id", seriesIds)
    .order("series_order");

  if (error) throw error;
  return data;
};

export const getBooksByWorkIds = async ({
  supabase,
  workIds,
}: {
  supabase: SupabaseClient<Database>;
  workIds: string[];
}) => {
  if (workIds.length === 0) return [];
  const { data, error } = await supabase
    .from("books")
    .select("id, title, edition_info, work_id")
    .in("work_id", workIds);

  if (error) throw error;
  return data;
};

export const getStandaloneWorksWithCount = async ({
  supabase,
  page,
  pageSize,
  q,
}: {
  supabase: SupabaseClient<Database>;
  page: number;
  pageSize: number;
  q?: string;
}) => {
  let query = supabase
    .from("works")
    .select("id, title, series_id, series_order", { count: "exact" })
    .is("series_id", null)
    .order("title");

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data, count, error } = await query.range((page - 1) * pageSize, page * pageSize - 1);

  if (error) throw error;
  return { data, count };
};
