import type { SupabaseClient } from "@supabase/supabase-js";
import type z from "zod";
import type { Database } from "~/supabase-client.ts";
import type { formSchema } from "./pages/settings-page.tsx";

export const updateProfile = async ({
  supabase,
  profile_id,
  data,
}: {
  supabase: SupabaseClient<Database>;
  profile_id: string;
  data: z.infer<typeof formSchema>;
}) => {
  const { error } = await supabase.from("profiles").update(data).eq("id", profile_id);
  if (error) {
    throw error;
  }
};

export const updateAvatar = async ({
  supabase,
  profile_id,
  avatar,
}: {
  supabase: SupabaseClient<Database>;
  profile_id: string;
  avatar: string;
}) => {
  const { error } = await supabase.from("profiles").update({ avatar }).eq("id", profile_id);
  if (error) {
    throw error;
  }
};
