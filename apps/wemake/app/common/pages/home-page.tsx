import { Button } from "@ryugibo/ui/button";
import { DateTime } from "luxon";
import { Link } from "react-router";
import { PostCard } from "~/features/community/components/post-card";
import { getPosts } from "~/features/community/queries";
import { IdeaCard } from "~/features/ideas/components/idea-card";
import { getIdeas } from "~/features/ideas/queries";
import { JobCard } from "~/features/jobs/components/job-card";
import { ProductCard } from "~/features/products/components/product-card";
import { getProductsByDateRange } from "~/features/products/queries";
import { TeamCard } from "~/features/teams/components/team-card";
import type { Route } from "./+types/home-page";

export const meta: Route.MetaFunction = () => [
  {
    title: "Home",
  },
  { name: "description", content: "Welcome to wemake" },
];

export const loader = async () => {
  const products = await getProductsByDateRange({
    startDate: DateTime.now().startOf("day"),
    endDate: DateTime.now().endOf("day"),
    limit: 7,
  });
  const posts = await getPosts({
    limit: 7,
    sorting: "newest",
    period: "all",
  });
  const ideas = await getIdeas({ limit: 7 });
  return { products, posts, ideas };
};

export default function HomePage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="px-20 space-y-40">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">Today's Products</h2>
          <p className="text-2xl font-light text-foreground">
            The best products made by our community today.
          </p>
          <Button variant="link" asChild className="text-lg p-0">
            <Link to="/products">Explore all products &rarr;</Link>
          </Button>
        </div>
        {loaderData.products.map((product) => (
          <ProductCard
            key={`${product.id}`}
            id={`${product.id}`}
            title={product.name}
            description={product.description}
            reviewsCount={product.reviews}
            viewsCount={product.views}
            upvotesCount={product.upvotes}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">Latest Discussions</h2>
          <p className="text-2xl font-light text-foreground">
            The latest discussions from our community.
          </p>
          <Button variant="link" asChild className="text-lg p-0">
            <Link to="/community">Explore all discussions &rarr;</Link>
          </Button>
        </div>
        {loaderData.posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            authorName={post.author}
            authorAvatarUrl={post.author_avatar}
            category={post.topic}
            postedAt={post.created_at}
            upvotesCount={post.upvotes}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">IdeasGPT</h2>
          <p className="text-2xl font-light text-foreground">Find ideas for your next project.</p>
          <Button variant="link" asChild className="text-lg p-0">
            <Link to="/ideas">Explore all ideas &rarr;</Link>
          </Button>
        </div>
        {loaderData.ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            id={idea.id}
            title={idea.idea}
            viewCount={idea.views}
            createdAt={idea.created_at}
            likesCount={idea.likes}
            claimed={idea.is_claimed}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">Latest Jobs</h2>
          <p className="text-2xl font-light text-foreground">Find jobs for your next project.</p>
          <Button variant="link" asChild className="text-lg p-0">
            <Link to="/jobs">Explore all jobs &rarr;</Link>
          </Button>
        </div>
        {[...Array(11).keys()].map((index) => (
          <JobCard
            key={`jobId-${index}`}
            id={`jobId-${index}`}
            companyName={"Tesla Motors"}
            companyLogoUrl={"https://github.com/teslamotors.png"}
            title={"Software Engineer"}
            postedAt={"12 hours ago"}
            type={"Full-time"}
            locationType={"Remote"}
            salary={"$100,000 - $150,000"}
            location={"San Francisco, CA"}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <h2 className="text-5xl font-bold leading-tight tracking-tight">Find a team member</h2>
          <p className="text-2xl font-light text-foreground">
            Find a team member for your next project.
          </p>
          <Button variant="link" asChild className="text-lg p-0">
            <Link to="/teams">Explore all teams &rarr;</Link>
          </Button>
        </div>
        {[...Array(7).keys()].map((index) => (
          <TeamCard
            key={`teamId-${index}`}
            id={`teamId-${index}`}
            leaderName={"wemake"}
            leaderAvatarUrl={"https://github.com/shadcn.png"}
            positions={["React Developer", "Backend Developer", "Product Manager"]}
            projectDescription={"a new social media platform"}
          />
        ))}
      </div>
    </div>
  );
}
