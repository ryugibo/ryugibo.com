import { Button } from "@ryugibo/ui";
import { DateTime } from "luxon";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero.tsx";
import { ProductPagination } from "~/common/components/product-pagination.tsx";
import { ProductCard } from "~/features/products/components/product-card.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { getProductPagesByDateRange, getProductsByDateRange } from "../queries.ts";
import type { Route } from "./+types/leaderboards-daily-page";

export const meta = ({ loaderData }: Route.MetaArgs) => {
  if (!loaderData) {
    return [{ title: "The best products | wemake" }];
  }
  const { dateObject } = loaderData;
  const date = DateTime.fromObject(dateObject);
  return [{ title: `The best products of ${date.toLocaleString(DateTime.DATE_MED)} | wemake` }];
};

const paramsSchema = z.object({
  year: z.coerce.number(),
  month: z.coerce.number(),
  day: z.coerce.number(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success: successDate, data: dataDate } = paramsSchema.safeParse(params);
  if (!successDate) {
    throw data({ error_code: "invalid_date", message: "invalid date" }, { status: 400 });
  }
  const date = DateTime.fromObject(dataDate);
  if (!date.isValid) {
    throw data({ error_code: "invalid_date", message: "invalid date" }, { status: 400 });
  }
  const today = DateTime.now().startOf("day");
  if (date > today) {
    throw data({ error_code: "future_date", message: "future date" }, { status: 400 });
  }
  const url = new URL(request.url);
  const { supabase } = createSSRClient(request);
  const page = Number(url.searchParams.get("page")) || 1;
  const products = await getProductsByDateRange({
    supabase,
    startDate: date.startOf("day"),
    endDate: date.endOf("day"),
    page,
  });
  const totalPages = await getProductPagesByDateRange({
    supabase,
    startDate: date.startOf("day"),
    endDate: date.endOf("day"),
  });
  return {
    dateObject: dataDate,
    products,
    totalPages,
  };
};

export default function LeaderboardsDailyPage({ loaderData }: Route.ComponentProps) {
  const { dateObject, products, totalPages } = loaderData;
  const urlDate = DateTime.fromObject(dateObject);
  const prevDate = urlDate.minus({ days: 1 });
  const nextDate = urlDate.plus({ days: 1 });
  const isToday = urlDate.equals(DateTime.now().startOf("day"));
  return (
    <div className="space-y-10">
      <Hero title={`The best products of ${urlDate.toLocaleString(DateTime.DATE_MED)}`} />
      <div className="flex items-center justify-center gap-2">
        <Button variant="secondary">
          <Link
            to={`/products/leaderboards/daily/${prevDate.year}/${prevDate.month}/${prevDate.day}`}
          >
            &larr; {prevDate.toLocaleString(DateTime.DATE_SHORT)}
          </Link>
        </Button>
        {!isToday && (
          <Button variant="secondary">
            <Link
              to={`/products/leaderboards/daily/${nextDate.year}/${nextDate.month}/${nextDate.day}`}
            >
              {nextDate.toLocaleString(DateTime.DATE_SHORT)} &rarr;
            </Link>
          </Button>
        )}
      </div>
      <div className="space-y-5 w-full max-w-3xl mx-auto">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            description={product.tagline}
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
