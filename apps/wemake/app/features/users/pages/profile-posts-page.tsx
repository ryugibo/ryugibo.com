import { PostCard } from "~/features/community/components/post-card";

export default function ProfilePostsPage() {
  return (
    <div className="flex flex-col gap-5">
      {[...Array(5).keys()].map((index) => (
        <PostCard
          key={`postId-${index}`}
          id={`postId-${index}`}
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
