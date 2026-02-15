import { Button, Card, CardContent, CardHeader, CardTitle } from "@ryugibo/ui";
import { Plus, Search } from "@ryugibo/ui/icons";
import { data, Link } from "react-router";
import { getBookCount } from "~/features/library/queries.ts";
import { getProfileById, getProfileByUsername } from "~/features/profile/queries.ts";
import { createSSRClient } from "~/supabase.server.ts";
import { useTranslation } from "../hooks/use-translation.ts";
import type { Route } from "./+types/dashboard-page";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers } = createSSRClient(request);
  const { data: dataUser, error: errorUser } = await supabase.auth.getUser();
  let profile_id: string;
  if (errorUser) {
    const profile = await getProfileByUsername({ supabase, username: "ryugibo" });
    if (!profile) {
      throw new Error("Profile not found");
    }
    profile_id = profile.id;
    const { count } = await getBookCount({ supabase, profile_id });
    return data({ profile, count, isLoggedIn: false }, { headers });
  } else {
    const {
      user: { id },
    } = dataUser;
    const profile = await getProfileById({ supabase, id });
    if (!profile) {
      throw new Error("Profile not found");
    }
    const { count } = await getBookCount({ supabase, profile_id: id });
    return data({ profile, count, isLoggedIn: true }, { headers });
  }
};

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { profile, count, isLoggedIn } = loaderData;

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-4">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {isLoggedIn
              ? t("dashboard.welcome", { name: profile.username })
              : `${profile.username}의 서재 미리보기`}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isLoggedIn ? t("dashboard.subtitle") : "로그인하여 나만의 서재를 만들어보세요."}
          </p>
        </div>
        <div className="flex gap-4">
          {isLoggedIn && (
            <Button asChild>
              <Link to="/books/search">
                <Search className="mr-2 h-4 w-4" /> 책 검색
              </Link>
            </Button>
          )}
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {t("dashboard.totalBooks")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">{count}</div>
          </CardContent>
        </Card>
        {isLoggedIn && (
          <Card className="flex flex-col items-center justify-center border-2 border-dashed cursor-pointer hover:bg-accent/50 transition-colors">
            <Link to="/books/search" className="p-6 text-center">
              <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("dashboard.addBook")}
              </span>
            </Link>
          </Card>
        )}
      </section>
    </div>
  );
}
