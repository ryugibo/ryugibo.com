import { Button } from "@ryugibo/ui/button";
import { DateTime } from "luxon";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero";
import { ProductPagination } from "~/common/components/product-pagination";
import { ProductCard } from "~/features/products/components/product-card";
import { getProductPagesByDateRange, getProductsByDateRange } from "../queries";
import type { Route } from "./+types/leaderboards-weekly-page";

export const meta = ({ loaderData }: Route.MetaArgs) => {
  if (!loaderData) {
    return [{ title: "Best of week | wemake" }];
  }
  const { dateObject } = loaderData;
  const date = DateTime.fromObject(dateObject);
  return [
    {
      title: `Best of week ${date.startOf("week").toLocaleString(DateTime.DATE_SHORT)} - ${date.endOf("week").toLocaleString(DateTime.DATE_SHORT)} | wemake`,
    },
  ];
};

const paramsSchema = z.object({
  weekYear: z.coerce.number(),
  weekNumber: z.coerce.number(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  if (!success) {
    throw data({ error_code: "invalid_date", message: "invalid date" }, { status: 400 });
  }
  const date = DateTime.fromObject(parsedData);
  if (!date.isValid) {
    throw data({ error_code: "invalid_date", message: "invalid date" }, { status: 400 });
  }
  const today = DateTime.now().startOf("day");
  if (date > today) {
    throw data({ error_code: "future_date", message: "future date" }, { status: 400 });
  }
  const url = new URL(request.url);
  const products = await getProductsByDateRange({
    startDate: date.startOf("week"),
    endDate: date.endOf("week"),
    page: Number(url.searchParams.get("page")) || 1,
  });
  const totalPages = await getProductPagesByDateRange({
    startDate: date.startOf("week"),
    endDate: date.endOf("week"),
  });
  return {
    dateObject: parsedData,
    products,
    totalPages,
  };
};

export default function LeaderboardsWeeklyPage({ loaderData }: Route.ComponentProps) {
  const { dateObject, products, totalPages } = loaderData;
  const urlDate = DateTime.fromObject(dateObject);
  const prevDate = urlDate.minus({ weeks: 1 });
  const nextDate = urlDate.plus({ weeks: 1 });
  const isToday = urlDate.equals(DateTime.now().startOf("week"));
  return (
    <div className="space-y-10">
      <Hero
        title={`Best of week ${urlDate.startOf("week").toLocaleString(DateTime.DATE_SHORT)} - ${urlDate.endOf("week").toLocaleString(DateTime.DATE_SHORT)}`}
      />
      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary">
          <Link to={`/products/leaderboards/weekly/${prevDate.weekYear}/${prevDate.weekNumber}`}>
            &larr; {prevDate.toLocaleString(DateTime.DATE_SHORT)}
          </Link>
        </Button>
        {!isToday && (
          <Button variant="secondary">
            <Link to={`/products/leaderboards/weekly/${nextDate.weekYear}/${nextDate.weekNumber}`}>
              {nextDate.toLocaleString(DateTime.DATE_SHORT)} &rarr;
            </Link>
          </Button>
        )}
      </div>
      <div className="space-y-5 w-full max-w-3xl mx-auto">
        {products.map((product) => (
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
      <ProductPagination totalPages={totalPages} />
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
