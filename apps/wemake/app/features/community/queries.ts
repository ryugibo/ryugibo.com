import { asc, count, eq } from "@ryugibo/db";
import db from "~/db";
import { profiles } from "../users/schema";
import { posts, postUpvotes, topics } from "./schema";

export const getTopics = async () => {
  const allTopics = await db
    .select({
      name: topics.name,
      slug: topics.slug,
    })
    .from(topics);
  return allTopics;
};

export const getPosts = async () => {
  const allPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      createdAt: posts.created_at,
      topic: topics.name,
      author: profiles.name,
      username: profiles.username,
      avatar: profiles.avatar,
      upvotes: count(postUpvotes.post_id),
    })
    .from(posts)
    .innerJoin(topics, eq(posts.topic_id, topics.id))
    .innerJoin(profiles, eq(posts.profile_id, profiles.id))
    .leftJoin(postUpvotes, eq(posts.id, postUpvotes.post_id))
    .groupBy(posts.id, profiles.id, topics.id)
    .orderBy(asc(posts.id));
  return allPosts;
};
