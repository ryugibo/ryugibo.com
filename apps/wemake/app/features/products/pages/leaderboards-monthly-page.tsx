import { DateTime } from "luxon";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductPagination } from "~/common/components/product-pagination";
import { Button } from "~/common/components/ui/button";
import { ProductCard } from "~/features/products/components/product-card";
import type { Route } from "./+types/leaderboards-monthly-page";

export const meta = ({ loaderData }: Route.MetaArgs) => {
  if (!loaderData) {
    return [{ title: "Best of month | wemake" }];
  }
  const date = DateTime.fromObject(loaderData);
  return [
    {
      title: `Best of month ${date.startOf("month").toLocaleString({ month: "long", year: "numeric" })} | wemake`,
    },
  ];
};

const paramsSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
});

export const loader = ({ params }: Route.LoaderArgs) => {
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  if (!success) {
    throw data({ error_code: "invalid_date", message: "invalid date" }, { status: 400 });
  }
  const date = DateTime.fromObject(parsedData);
  if (!date.isValid) {
    throw data({ error_code: "invalid_date", message: "invalid date" }, { status: 400 });
  }
  const today = DateTime.now().startOf("month");
  if (date > today) {
    throw data({ error_code: "future_date", message: "future date" }, { status: 400 });
  }
  return {
    ...parsedData,
  };
};

export default function LeaderboardsMonthlyPage({ loaderData }: Route.ComponentProps) {
  const urlDate = DateTime.fromObject(loaderData);
  const prevDate = urlDate.minus({ month: 1 });
  const nextDate = urlDate.plus({ month: 1 });
  const isToday = urlDate.equals(DateTime.now().startOf("month"));
  return (
    <div className="space-y-10">
      <Hero
        title={`Best of month ${urlDate.startOf("month").toLocaleString({ month: "long", year: "numeric" })}`}
      />
      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary">
          <Link to={`/products/leaderboards/monthly/${prevDate.year}/${prevDate.month}`}>
            &larr; {prevDate.toLocaleString({ month: "long", year: "numeric" })}
          </Link>
        </Button>
        {!isToday && (
          <Button variant="secondary">
            <Link to={`/products/leaderboards/monthly/${nextDate.year}/${nextDate.month}`}>
              {nextDate.toLocaleString({ month: "long", year: "numeric" })} &rarr;
            </Link>
          </Button>
        )}
      </div>
      <div className="space-y-5 w-full max-w-3xl mx-auto">
        {[...Array(11).keys()].map((index) => (
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
