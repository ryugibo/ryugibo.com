import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase.ts";

export const updateRequestStatus = async ({
  supabase,
  requestId,
  status,
}: {
  supabase: SupabaseClient<Database>;
  requestId: string;
  status: "approved" | "rejected";
}) => {
  const { error } = await supabase
    .from("book_grouping_requests")
    .update({ status })
    .eq("id", requestId);
  if (error) throw error;
};

export const createWork = async ({
  supabase,
  title,
  series_id,
}: {
  supabase: SupabaseClient<Database>;
  title: string;
  series_id?: string;
}) => {
  const { data, error } = await supabase
    .from("works")
    .insert({ title, series_id })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const upsertBook = async ({
  supabase,
  isbn,
  title,
  work_id,
}: {
  supabase: SupabaseClient<Database>;
  isbn?: string; // Optional because upsert might use id, but usually purely new upsert uses keys. existing logic uses isbn
  title?: string;
  work_id?: string;
  // If updating by ID, we need ID. But requests page logic uses isbn as key.
  // Let's support the exact logic used in the page (upsert by isbn).
}) => {
  // Logic from admin-requests-page:
  // upsert({ isbn, title, work_id }, { onConflict: "isbn" })
  if (!isbn) throw new Error("ISBN required for upsertBook in this context");

  const { error } = await supabase.from("books").upsert(
    {
      isbn,
      title: title || "Unknown Title",
      work_id,
    },
    { onConflict: "isbn" },
  );
  if (error) throw error;
};

export const insertSeries = async ({
  supabase,
  title,
}: {
  supabase: SupabaseClient<Database>;
  title: string;
}) => {
  const { data, error } = await supabase.from("series").insert({ title }).select().single();
  if (error) throw error;
  return data;
};

export const updateWork = async ({
  supabase,
  id,
  title,
  series_order,
  series_id,
}: {
  supabase: SupabaseClient<Database>;
  id: string;
  title?: string;
  series_order?: number | null;
  series_id?: string | null;
}) => {
  const updates: Record<string, string | number | null> = {};
  if (title !== undefined) updates.title = title;
  if (series_order !== undefined) updates.series_order = series_order;
  if (series_id !== undefined) updates.series_id = series_id;

  const { error } = await supabase.from("works").update(updates).eq("id", id);
  if (error) throw error;
};

export const updateSeries = async ({
  supabase,
  id,
  title,
}: {
  supabase: SupabaseClient<Database>;
  id: string;
  title: string;
}) => {
  const { error } = await supabase.from("series").update({ title }).eq("id", id);
  if (error) throw error;
};

export const updateBookEdition = async ({
  supabase,
  id,
  edition_info,
}: {
  supabase: SupabaseClient<Database>;
  id: number;
  edition_info: string;
}) => {
  const { error } = await supabase.from("books").update({ edition_info }).eq("id", id);
  if (error) throw error;
};
