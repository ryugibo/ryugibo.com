import supabase from "~/supabase-client";

export const getLibrary = async () => {
  const { data, error } = await supabase.from("profile_books_list_view").select("*");

  if (error) {
    throw error;
  }

  return data;
};
