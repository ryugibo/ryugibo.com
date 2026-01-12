import { Link } from "react-router";
import { Hero } from "~/common/components/hero";
import { Button } from "~/common/components/ui/button";
import { ProductCard } from "~/features/products/components/product-card";
import type { Route } from "./+types/leaderboards-page";

export const meta: Route.MetaFunction = () => [
  { title: "Leaderboards | wemake" },
  { name: "description", content: "Product Leaderboards" },
];

export default function LeaderboardsPage() {
  return (
    <div className="space-y-20">
      <Hero title="Leaderboards" description="The most popular products on wemake" />
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">Daily Leaderboard</h2>
          <p className="text-xl font-light text-foreground">
            The most popular products on wemake by day.
          </p>
        </div>
        {[...Array(10).keys()].map((index) => (
          <ProductCard
            key={`productId-${index}`}
            id={`productId-${index}`}
            title={"Product Title"}
            description={"Product Description"}
            commentsCount={12}
            viewsCount={12}
            upvotesCount={120}
          />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/daily">Explore all products &rarr;</Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">Weekly Leaderboard</h2>
          <p className="text-xl font-light text-foreground">
            The most popular products on wemake by week.
          </p>
        </div>
        {[...Array(10).keys()].map((index) => (
          <ProductCard
            key={`productId-${index}`}
            id={`productId-${index}`}
            title={"Product Title"}
            description={"Product Description"}
            commentsCount={12}
            viewsCount={12}
            upvotesCount={120}
          />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/weekly">Explore all products &rarr;</Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">Monthly Leaderboard</h2>
          <p className="text-xl font-light text-foreground">
            The most popular products on wemake by month.
          </p>
        </div>
        {[...Array(10).keys()].map((index) => (
          <ProductCard
            key={`productId-${index}`}
            id={`productId-${index}`}
            title={"Product Title"}
            description={"Product Description"}
            commentsCount={12}
            viewsCount={12}
            upvotesCount={120}
          />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/monthly">Explore all products &rarr;</Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight">Yearly Leaderboard</h2>
          <p className="text-xl font-light text-foreground">
            The most popular products on wemake by year.
          </p>
        </div>
        {[...Array(10).keys()].map((index) => (
          <ProductCard
            key={`productId-${index}`}
            id={`productId-${index}`}
            title={"Product Title"}
            description={"Product Description"}
            commentsCount={12}
            viewsCount={12}
            upvotesCount={120}
          />
        ))}
        <Button variant="link" asChild className="text-lg self-center">
          <Link to="/products/leaderboards/yearly">Explore all products &rarr;</Link>
        </Button>
      </div>
    </div>
  );
}
