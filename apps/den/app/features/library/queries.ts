import supabase from "~/supabase-client";

export const getLibrary = async ({ keyword }: { keyword?: string }) => {
  const query = supabase.from("profile_books_list_view").select("*");

  if (keyword) {
    query.ilike("title", `%${keyword}%`);
  }

  const { data, error } = await query;
  if (error) {
    throw error;
  }

  return data;
};
