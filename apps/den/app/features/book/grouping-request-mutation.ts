import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supabase.ts";

export const createGroupingRequest = async ({
  supabase,
  userId,
  isbn,
  requestType,
  message,
}: {
  supabase: SupabaseClient<Database>;
  userId?: string;
  isbn: string;
  requestType: "series" | "edition" | "other" | string;
  message?: string;
}) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const payload = {
    book_isbn: isbn,
    request_type: requestType,
    message,
    status: "pending",
    ...(userId ? { user_id: userId } : {}),
  };

  const { error } = await supabase.from("book_grouping_requests").insert(payload);

  if (error) throw error;
};
