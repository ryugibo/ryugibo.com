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
import { CartesianGrid, Line, LineChart, XAxis } from "@ryugibo/ui/recharts";
import { redirect } from "react-router";
import { createSSRClient } from "~/supabase-client.ts";
import { getDashboardStats } from "../queries.ts";
import type { Route } from "./+types/dashboard-page";

export const meta = (_: Route.MetaArgs) => [
  { title: "Dashboard | wemake" },
  { name: "description", content: "Dashboard" },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, getAuthUser } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    throw redirect("/");
  }
  const { id: profile_id } = user;
  const { stats } = await getDashboardStats({ supabase, profile_id });
  return { stats };
};

const chartConfig = {
  views: {
    label: "👁️",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const { stats } = loaderData;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Profile views</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
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
                padding={{ left: 12, right: 12 }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Line
                dataKey="views"
                type="natural"
                stroke="var(--color-views)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
