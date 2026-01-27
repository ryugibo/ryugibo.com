import { redirect } from "react-router";
import type { Route } from "./+types/my-profile-page";

export const loader = (_: Route.LoaderArgs) => {
  // find the user using the cookies
  return redirect("/users/mr.35be5d21");
};
