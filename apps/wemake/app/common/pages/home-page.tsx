import { Button } from "@ryugibo/ui/button";
import { DateTime } from "luxon";
import { Link } from "react-router";
import { PostCard } from "~/features/community/components/post-card.tsx";
import { getPosts } from "~/features/community/queries.ts";
import { IdeaCard } from "~/features/ideas/components/idea-card.tsx";
import { getIdeas } from "~/features/ideas/queries.ts";
import { JobCard } from "~/features/jobs/components/job-card.tsx";
import { getJobs } from "~/features/jobs/queries.ts";
import { ProductCard } from "~/features/products/components/product-card.tsx";
import { getProductsByDateRange } from "~/features/products/queries.ts";
import { TeamCard } from "~/features/teams/components/team-card.tsx";
import { getTeams } from "~/features/teams/queries.ts";
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
  const jobs = await getJobs({ limit: 11 });
  const teams = await getTeams({ limit: 7 });
  return { products, posts, ideas, jobs, teams };
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
        {loaderData.jobs.map((job) => (
          <JobCard
            key={job.id}
            id={job.id}
            companyName={job.company_name}
            companyLogoUrl={job.company_logo}
            title={job.position}
            postedAt={job.created_at}
            type={job.job_type}
            locationType={job.location}
            salary={job.salary_range}
            location={job.company_location}
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
        {loaderData.teams.map((team) => (
          <TeamCard
            key={team.id}
            id={team.id}
            leaderName={team.team_leader.username}
            leaderAvatarUrl={team.team_leader.avatar}
            positions={team.roles.split(",")}
            projectDescription={team.product_description}
          />
        ))}
      </div>
    </div>
  );
}
