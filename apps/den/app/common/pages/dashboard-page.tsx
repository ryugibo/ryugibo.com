import { Button, Card, CardContent, CardHeader, CardTitle } from "@ryugibo/ui";
import { Plus, Search } from "@ryugibo/ui/icons";
import { Link } from "react-router";
import { createSSRClient } from "~/supabase.server.ts";
import { useTranslation } from "../hooks/use-translation.ts";
import type { Route } from "./+types/dashboard-page";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);

  const { count } = await supabase
    .from("profile_books_list_view")
    .select("*", { count: "exact", head: true });

  return {
    totalBooks: count ?? 0,
  };
};

export default function DashboardPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { totalBooks } = loaderData;

  return (
    <div className="flex flex-1 flex-col gap-8 p-4 pt-4">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("dashboard.welcome", { name: "Ryugibo" })}
          </h1>
          <p className="text-muted-foreground mt-2">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/books/search">
              <Search className="mr-2 h-4 w-4" /> 책 검색
            </Link>
          </Button>
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
            <div className="text-4xl font-bold text-foreground">{totalBooks}</div>
          </CardContent>
        </Card>
        <Card className="flex flex-col items-center justify-center border-2 border-dashed cursor-pointer hover:bg-accent/50 transition-colors">
          <Link to="/books/search" className="p-6 text-center">
            <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <span className="text-sm font-medium text-muted-foreground">
              {t("dashboard.addBook")}
            </span>
          </Link>
        </Card>
      </section>
    </div>
  );
}
