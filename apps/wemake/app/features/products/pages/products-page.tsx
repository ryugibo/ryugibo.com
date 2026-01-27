import { redirect } from "react-router";
import type { Route } from "./+types/products-page";

export const loader = (_: Route.LoaderArgs) => {
  return redirect("/products/leaderboards");
};
