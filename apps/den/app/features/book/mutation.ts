import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase.ts";
import type { BookSource } from "../library/constant.ts";

export const addBook = async ({
  supabase,
  profile_id,
  isbn,
  title,
  source,
}: {
  supabase: SupabaseClient<Database>;
  profile_id: string;
  isbn: string;
  title: string;
  source: BookSource;
}) => {
  const { data: bookData, error: bookError } = await supabase
    .from("books")
    .upsert({ isbn, title }, { onConflict: "isbn" })
    .select("id")
    .single();
  if (bookError) {
    throw bookError;
  }
  const { id: book_id } = bookData;
  console.log(profile_id);
  const { error } = await supabase.from("profile_books").insert({ profile_id, book_id, source });

  if (error) {
    throw error;
  }
};

export const removeBook = async ({
  supabase,
  profile_id,
  isbn,
}: {
  supabase: SupabaseClient<Database>;
  profile_id: string;
  isbn: string;
}) => {
  // First, get the book_id from the ISBN
  const { data: bookData, error: bookError } = await supabase
    .from("books")
    .select("id")
    .eq("isbn", isbn)
    .single();

  if (bookError) {
    throw bookError;
  }

  const { id: book_id } = bookData;

  // Delete from profile_books using the composite key
  const { error } = await supabase
    .from("profile_books")
    .delete()
    .eq("profile_id", profile_id)
    .eq("book_id", book_id);

  if (error) {
    throw error;
  }
};
