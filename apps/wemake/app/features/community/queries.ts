import supabase from "~/supabase-client";

export const getTopics = async () => {
  const { data, error } = await supabase.from("topics").select("name, slug");
  if (error) {
    throw error;
  }
  return data;
};

export const getPosts = async () => {
  const { data, error } = await supabase.from("community_post_list_view").select("*");
  if (error) {
    throw error;
  }
  return data;
};
