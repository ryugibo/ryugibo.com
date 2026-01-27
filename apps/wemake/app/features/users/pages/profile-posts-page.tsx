import { PostCard } from "~/features/community/components/post-card.tsx";
import type { Route } from "./+types/profile-posts-page";

export default function ProfilePostsPage(_: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-5">
      {[...Array(5).keys()].map((index) => (
        <PostCard
          key={index}
          id={index}
          title={"What is the best productivity tool?"}
          authorName={"Wemake"}
          authorAvatarUrl={"https://github.com/shadcn.png"}
          category={"Productivity"}
          postedAt={"12 hours ago"}
          expanded={true}
        />
      ))}
    </div>
  );
}
