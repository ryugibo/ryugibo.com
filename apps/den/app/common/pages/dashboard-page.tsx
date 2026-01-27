import { Button } from "@ryugibo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ryugibo/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { BookCover } from "../../features/book/components/book-cover.tsx";
import { useTranslation } from "../hooks/use-translation.ts";
import AppLayout from "../layouts/app-layout.tsx";
import type { Route } from "./+types/dashboard-page";

export default function DashboardPage(_: Route.ComponentProps) {
  const { t } = useTranslation();

  const recentBooks = [
    {
      id: 1,
      title: "The Design of Everyday Things",
      author: "Don Norman",
      cover:
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300&h=450",
    },
    {
      id: 2,
      title: "Refactoring UI",
      author: "Adam Wathan",
      cover:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300&h=450",
    },
    {
      id: 3,
      title: "Clean Code",
      author: "Robert C. Martin",
      cover:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300&h=450",
    },
    {
      id: 4,
      title: "Zero to One",
      author: "Peter Thiel",
      cover:
        "https://images.unsplash.com/photo-1555239167-a22ff5d3be9e?auto=format&fit=crop&q=80&w=300&h=450",
    },
  ];

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-8 p-4 pt-4">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t("dashboard.welcome", { name: "Ryugibo" })}
            </h1>
            <p className="text-muted-foreground mt-2">{t("dashboard.subtitle")}</p>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="secondary">
              <Link to="/library">{t("dashboard.myLibrary")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/settings">{t("nav.settings")}</Link>
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {t("dashboard.totalBooks")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-foreground">124</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {t("dashboard.readingStreak")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-emerald-500">12{t("dashboard.days")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {t("nav.collections")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-indigo-500">8</div>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              {t("dashboard.recentlyAdded")}
            </h2>
            <Button variant="link" asChild className="text-muted-foreground hover:text-foreground">
              <Link to="/library">{t("dashboard.viewAll")} &rarr;</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recentBooks.map((book) => (
              <Link
                key={book.id}
                to={`/library/${book.id}`}
                className="group relative block transition-all hover:-translate-y-1"
              >
                <BookCover src={book.cover} alt={book.title} />
                <div className="mt-3 space-y-1">
                  <h3 className="text-base font-medium leading-none text-foreground truncate">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                </div>
              </Link>
            ))}
            <Link
              to="/books/search"
              className="group flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-all aspect-2/3"
            >
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-muted-foreground font-medium text-sm">
                {t("dashboard.addBook")}
              </span>
            </Link>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
