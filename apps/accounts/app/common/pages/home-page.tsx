import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ryugibo/ui";
import { BookOpen } from "@ryugibo/ui/icons";
import { resolveAppUrl } from "@ryugibo/utils";
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
  const denUrl = resolveAppUrl("den");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20 p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <a href={denUrl} className="block group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  Den
                </CardTitle>
                <CardDescription>Your personal book library and reading tracker.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Go to Den &rarr;</p>
              </CardContent>
            </Card>
          </a>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" asChild>
            <Link to="/logout">Logout</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
