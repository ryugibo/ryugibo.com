import type { DateTime } from "luxon";
import supabase from "~/supabase-client.ts";
import { PAGE_SIZE } from "./constants.ts";

export const getProductsByDateRange = async ({
  startDate,
  endDate,
  limit = PAGE_SIZE,
  page = 1,
}: {
  startDate: DateTime;
  endDate: DateTime;
  limit?: number;
  page?: number;
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
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw error;
  }

  return data;
};

export const getProductPagesByDateRange = async ({
  startDate,
  endDate,
}: {
  startDate: DateTime;
  endDate: DateTime;
}) => {
  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .gte("created_at", startDate.toISO())
    .lte("created_at", endDate.toISO());

  if (error) {
    throw error;
  }
  if (!count) {
    return 1;
  }

  return Math.ceil(count / PAGE_SIZE);
};
