import { Button } from "@ryugibo/ui";
import { DateTime } from "luxon";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero.tsx";
import { ProductPagination } from "~/common/components/product-pagination.tsx";
import { ProductCard } from "~/features/products/components/product-card.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { getProductPagesByDateRange, getProductsByDateRange } from "../queries.ts";
import type { Route } from "./+types/leaderboards-yearly-page";

export const meta = ({ loaderData }: Route.MetaArgs) => {
  if (!loaderData) {
    return [{ title: "Best of year | wemake" }];
  }
  const { dateObject } = loaderData;
  const date = DateTime.fromObject(dateObject);
  return [
    {
      title: `Best of year ${date.startOf("year").toLocaleString({ year: "numeric" })} | wemake`,
    },
  ];
};

const paramsSchema = z.object({
  year: z.coerce.number(),
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
  const today = DateTime.now().startOf("year");
  if (date > today) {
    throw data({ error_code: "future_date", message: "future date" }, { status: 400 });
  }
  const url = new URL(request.url);
  const { supabase, headers } = createSSRClient(request);
  const products = await getProductsByDateRange({
    supabase,
    startDate: date.startOf("year"),
    endDate: date.endOf("year"),
    page: Number(url.searchParams.get("page")) || 1,
  });
  const totalPages = await getProductPagesByDateRange({
    supabase,
    startDate: date.startOf("year"),
    endDate: date.endOf("year"),
  });
  return data(
    {
      dateObject: parsedData,
      products,
      totalPages,
    },
    { headers },
  );
};

export default function LeaderboardsYearlyPage({ loaderData }: Route.ComponentProps) {
  const { dateObject, products, totalPages } = loaderData;
  const urlDate = DateTime.fromObject(dateObject);
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
