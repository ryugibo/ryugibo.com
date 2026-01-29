import { Button } from "@ryugibo/ui";
import { Link, redirect } from "react-router";
import { createSSRClient } from "~/supabase-client.ts";
import type { Route } from "./+types/home-page";

export const meta = () => {
  return [{ title: "Home | Accounts" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return { user };
};

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-10">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">You are logged in!</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
      <Button asChild size="lg" className="w-full max-w-sm text-lg h-14">
        <Link to="/logout">Logout</Link>
      </Button>
    </div>
  );
}
