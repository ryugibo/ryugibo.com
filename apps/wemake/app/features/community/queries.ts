import type { SupabaseClient } from "@supabase/supabase-js";
import { DateTime } from "luxon";
import type { PeriodOption, SortOption } from "~/features/community/constants.ts";
import type { Database } from "~/supabase-client.ts";

const REPLY_SELECT = `
id,
content,
created_at,
user:profiles (
  username,
  name,
  avatar
)
`;

export const getTopics = async ({ supabase }: { supabase: SupabaseClient<Database> }) => {
  const { data, error } = await supabase.from("topics").select("name, slug");
  if (error) {
    throw error;
  }
  return data;
};

export const getTopicIdBySlug = async ({
  supabase,
  slug,
}: {
  supabase: SupabaseClient<Database>;
  slug: string;
}) => {
  const { data, error } = await supabase
    .from("topics")
    .select("topic_id:id")
    .eq("slug", slug)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getPosts = async ({
  supabase,
  limit,
  sorting,
  period,
  keyword,
  topic,
}: {
  supabase: SupabaseClient<Database>;
  limit: number;
  sorting: SortOption;
  period: PeriodOption;
  keyword?: string;
  topic?: string;
}) => {
  const query = supabase.from("community_post_list_view").select("*").limit(limit);
  if (sorting === "popular") {
    query.order("upvotes", { ascending: false });

    const today = DateTime.now();
    if (period === "today") {
      query.gte("created_at", today.startOf("day").toISO());
    } else if (period === "week") {
      query.gte("created_at", today.startOf("week").toISO());
    } else if (period === "month") {
      query.gte("created_at", today.startOf("month").toISO());
    } else if (period === "year") {
      query.gte("created_at", today.startOf("year").toISO());
    }
  } else if (sorting === "newest") {
    query.order("created_at", { ascending: false });
  }
  if (keyword) {
    query.ilike("title", `%${keyword}%`);
  }
  if (topic) {
    query.eq("topic_slug", topic);
  }
  const { data, error } = await query;
  if (error) {
    throw error;
  }
  return data;
};

export const getPostById = async ({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>;
  id: number;
}) => {
  const { data, error } = await supabase
    .from("community_post_detail_view")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const getReplies = async ({
  supabase,
  id,
}: {
  supabase: SupabaseClient<Database>;
  id: number;
}) => {
  const { data, error } = await supabase
    .from("post_replies")
    .select(`
      ${REPLY_SELECT},
      post_replies (
        ${REPLY_SELECT}
      )
    `)
    .eq("post_id", id);

  if (error) {
    throw error;
  }

  return data;
};
