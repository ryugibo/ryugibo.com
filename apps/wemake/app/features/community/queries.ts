import { DateTime } from "luxon";
import type { PeriodOption, SortOption } from "~/features/community/constant";
import supabase from "~/supabase-client";

export const getTopics = async () => {
  const { data, error } = await supabase.from("topics").select("name, slug");
  if (error) {
    throw error;
  }
  return data;
};

export const getPosts = async ({
  limit,
  sorting,
  period,
  keyword,
  topic,
}: {
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
