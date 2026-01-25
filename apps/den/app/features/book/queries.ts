import supabase from "~/supabase-client";

export const getBook = async ({ id }: { id: number }) => {
  const { data, error } = await supabase.from("books").select("*").eq("id", id).single();

  if (error) {
    throw error;
  }

  return data;
};
