import type { SupabaseClient } from "@supabase/supabase-js";
import type z from "zod";
import type { Database } from "~/supabase-client.ts";
import type { formSchema } from "./pages/job-submit-page.tsx";

export const createJob = async (
  supabase: SupabaseClient<Database>,
  {
    data,
  }: {
    data: z.infer<typeof formSchema>;
  },
) => {
  const { data: job, error } = await supabase.from("jobs").insert(data).select().single();

  if (error) {
    throw error;
  }

  return job;
};
