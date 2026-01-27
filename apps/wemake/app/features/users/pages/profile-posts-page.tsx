import { z } from "zod";
import { PostCard } from "~/features/community/components/post-card.tsx";
import { getPostsByUsername } from "../queries.ts";
import type { Route } from "./+types/profile-posts-page";

const paramsSchema = z.object({
  username: z.string(),
});

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid params");
  }
  const { username } = data;
  const posts = await getPostsByUsername(username);
  return { posts };
};

export default function ProfilePostsPage({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;
  return (
    <div className="flex flex-col gap-5">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          authorName={post.author}
          authorAvatarUrl={post.author_avatar}
          category={post.topic}
          postedAt={post.created_at}
          expanded={true}
        />
      ))}
    </div>
  );
}
