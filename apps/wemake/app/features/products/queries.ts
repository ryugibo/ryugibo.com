import type { DateTime } from "luxon";
import supabase from "~/supabase-client";

export const getProductsByDateRange = async ({
  startDate,
  endDate,
  limit,
}: {
  startDate: DateTime;
  endDate: DateTime;
  limit: number;
}) => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      stats->>upvotes,
      stats->>views,
      stats->>reviews
    `)
    .order("stats->>upvotes", { ascending: false })
    .gte("created_at", startDate.toISO())
    .lte("created_at", endDate.toISO())
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
};
