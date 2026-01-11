import { DateTime } from "luxon";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductPagination } from "~/common/components/product-pagination";
import { Button } from "~/common/components/ui/button";
import { ProductCard } from "~/features/products/components/product-card";
import type { Route } from "./+types/leaderboards-yearly";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Daily Leaderboard | wemake" },
    { name: "description", content: "Daily Product Leaderboard" },
  ];
}

const paramsSchema = z.object({
  year: z.coerce.number(),
});

export function loader({ params }: Route.LoaderArgs) {
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  if (!success) {
    throw data({ error_code: "invalid_date", message: "invalid date" }, { status: 400 });
  }
  const date = DateTime.fromObject(parsedData);
  if (!date.isValid) {
    throw data({ error_code: "invalid_date", message: "invalid date" }, { status: 400 });
  }
  const today = DateTime.now().startOf("year");
  if (date > today) {
    throw data({ error_code: "future_date", message: "future date" }, { status: 400 });
  }
  return {
    ...parsedData,
  };
}

const products = Array.from({ length: 11 }).map((_, index) => ({
  id: `productId-${index}`,
  title: "Product Title",
  description: "Product Description",
  commentsCount: 12,
  viewsCount: 12,
  upvotesCount: 120,
}));

export default function LeaderboardsYearlyPage({ loaderData }: Route.ComponentProps) {
  const urlDate = DateTime.fromObject(loaderData);
  const prevDate = urlDate.minus({ year: 1 });
  const nextDate = urlDate.plus({ year: 1 });
  const isToday = urlDate.equals(DateTime.now().startOf("year"));
  return (
    <div className="space-y-10">
      <Hero title={`Best of year ${urlDate.startOf("year").toLocaleString({ year: "numeric" })}`} />
      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary">
          <Link to={`/products/leaderboards/yearly/${prevDate.year}`}>
            &larr; {prevDate.toLocaleString({ year: "numeric" })}
          </Link>
        </Button>
        {!isToday && (
          <Button variant="secondary">
            <Link to={`/products/leaderboards/yearly/${nextDate.year}`}>
              {nextDate.toLocaleString({ year: "numeric" })} &rarr;
            </Link>
          </Button>
        )}
      </div>
      <div className="space-y-5 w-full max-w-3xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <ProductPagination totalPages={10} />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        {error.data.message} / {error.data.error_code}
      </div>
    );
  }
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }
  return <div>Unknown error</div>;
}
