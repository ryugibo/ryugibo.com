import { Link } from "react-router";
import { PostCard } from "../../features/community/components/post-card";
import { IdeaCard } from "../../features/ideas/components/idea-card";
import { JobCard } from "../../features/jobs/components/job-card";
import { ProductCard } from "../../features/products/components/product-card";
import { TeamCard } from "../../features/teams/components/team-card";
import { Button } from "../components/ui/button";
import type { Route } from "./+types/homepage";

export const meta: Route.MetaFunction = () => [
  {
    title: "Home",
  },
  { name: "description", content: "Welcome to wemake" },
];

const products = Array.from({ length: 11 }).map((_, index) => ({
  id: `productId-${index}`,
  title: "Product Title",
  description: "Product Description",
  commentsCount: 12,
  viewsCount: 12,
  upvotesCount: 120,
}));

const posts = Array.from({ length: 10 }).map((_, index) => ({
  id: `postId-${index}`,
  title: "What is the best productivity tool?",
  authorName: "Wemake",
  authorAvatarUrl: "https://github.com/shadcn.png",
  category: "Productivity",
  postedAt: "12 hours ago",
}));

const ideas = Array.from({ length: 10 }).map((_, index) => ({
  id: `ideaId-${index}`,
  title:
    "A startup that creates an AI-powered generated personal trainer, delivering customized fitness recommendations and tracking of progress using a mobile app to track workouts and progress as well as a website to manage the business.",
  viewCount: 123,
  createdAt: "12 hours ago",
  likesCount: 12,
  claimed: index % 2 === 0,
}));

const jobs = Array.from({ length: 10 }).map((_, index) => ({
  id: `jobId-${index}`,
  companyName: "Tesla Motors",
  companyLogoUrl: "https://github.com/teslamotors.png",
  title: "Software Engineer",
  postedAt: "12 hours ago",
  type: "Full-time",
  locationType: "Remote",
  salary: "$100,000 - $150,000",
  location: "San Francisco, CA",
}));

const teams = Array.from({ length: 10 }).map((_, index) => ({
  id: `teamId-${index}`,
  leaderName: "wemake",
  leaderAvatarUrl: "https://github.com/shadcn.png",
  positions: ["React Developer", "Backend Developer", "Product Manager"],
  projectDescription: "a new social media platform",
}));

export default function Homepage() {
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
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
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
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
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
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} {...idea} />
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
        {jobs.map((job) => (
          <JobCard key={job.id} {...job} />
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
        {teams.map((team) => (
          <TeamCard key={team.id} {...team} />
        ))}
      </div>
    </div>
  );
}
