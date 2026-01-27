import { Button } from "@ryugibo/ui/button";
import { DateTime } from "luxon";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero.tsx";
import { ProductPagination } from "~/common/components/product-pagination.tsx";
import { ProductCard } from "~/features/products/components/product-card.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { getProductPagesByDateRange, getProductsByDateRange } from "../queries.ts";
import type { Route } from "./+types/leaderboards-monthly-page";

export const meta = ({ loaderData }: Route.MetaArgs) => {
  if (!loaderData) {
    return [{ title: "Best of month | wemake" }];
  }
  const { dateObject } = loaderData;
  const date = DateTime.fromObject(dateObject);
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

export const loader = async ({ params, request }: Route.LoaderArgs) => {
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
  const url = new URL(request.url);
  const { supabase } = createSSRClient(request);
  const products = await getProductsByDateRange(supabase, {
    startDate: date.startOf("month"),
    endDate: date.endOf("month"),
    page: Number(url.searchParams.get("page")) || 1,
  });
  const totalPages = await getProductPagesByDateRange(supabase, {
    startDate: date.startOf("month"),
    endDate: date.endOf("month"),
  });
  return {
    dateObject: parsedData,
    products,
    totalPages,
  };
};

export default function LeaderboardsMonthlyPage({ loaderData }: Route.ComponentProps) {
  const { dateObject, products, totalPages } = loaderData;
  const urlDate = DateTime.fromObject(dateObject);
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
