import { data, Outlet } from "react-router";
import { z } from "zod";
import type { Route } from "./+types/leaderboards-layout";

const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { success: successPage } = searchParamsSchema.safeParse(
    Object.fromEntries(url.searchParams),
  );
  if (!successPage) {
    throw data(
      {
        error_code: "invalid_page",
        message: "Invalid page",
      },
      { status: 400 },
    );
  }
};

export default function LeaderboardLayout() {
  return <Outlet />;
}
