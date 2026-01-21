import supabase from "~/supabase-client";

export const getTopics = async () => {
  const { data, error } = await supabase.from("topics").select("name, slug");
  if (error) {
    throw error;
  }
  return data;
};

export const getPosts = async () => {
  const { data, error } = await supabase.from("posts").select(`
    id,
    title,
    created_at,
    topic_id,
    profile_id,
    topic:topics!inner (
      name
    ),
    author:profiles!posts_profile_id_profiles_id_fk!inner (
      name,
      username,
      avatar
    ),
    post_upvotes (
      count
    )
  `);
  if (error) {
    throw error;
  }
  return data;
};
