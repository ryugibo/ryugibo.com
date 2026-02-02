import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@ryugibo/ui";
import { Area, AreaChart, CartesianGrid, XAxis } from "@ryugibo/ui/recharts";
import { createSSRClient } from "~/supabase-client.ts";
import { ensureLoggedInProfileId, getProductStats } from "../queries.ts";
import type { Route } from "./+types/dashboard-product-page";

export const meta: Route.MetaFunction = () => [
  { title: "Product Dashboard | wemake" },
  { name: "description", content: "Product Dashboard" },
];

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);
  await ensureLoggedInProfileId({ supabase, redirect_path: "/" });
  // @TODO: should ensure profile_id is the owner of the product
  const { productId: product_id } = params;
  const { stats } = await getProductStats({ supabase, product_id });
  return { stats };
};

const chartConfig = {
  product_views: {
    label: "Page views",
    color: "var(--chart-1)",
  },
  product_visits: {
    label: "Visitors",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function DashboardProductPage({ loaderData }: Route.ComponentProps) {
  const { stats } = loaderData;
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold mb-6">Analytics</h1>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={stats}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
                wrapperStyle={{ minWidth: "200px" }}
              />
              <Area
                dataKey="product_views"
                type="natural"
                stroke="var(--color-product-views)"
                fill="var(--color-product-views)"
                strokeWidth={2}
                dot={false}
              />
              <Area
                dataKey="product_visits"
                type="natural"
                stroke="var(--color-product-visitors)"
                fill="var(--color-product-visitors)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
