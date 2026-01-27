import { Button } from "@ryugibo/ui/button";
import { Separator } from "@ryugibo/ui/separator";
import { ArrowLeft, Bookmark, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { createSSRClient } from "~/supabase-client.ts";
import { useTranslation } from "../../../common/hooks/use-translation.ts";
import AppLayout from "../../../common/layouts/app-layout.tsx";
import { BookCover } from "../components/book-cover.tsx";
import { getBook } from "../queries.ts";
import type { Route } from "./+types/book-details-page";

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);
  const book = await getBook(supabase, { id: parseInt(params.bookId, 10) });
  return { book };
};

export default function BookDetailsPage({ loaderData }: Route.ComponentProps) {
  const { book } = loaderData;
  const { t } = useTranslation();

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col p-4 max-w-5xl mx-auto w-full">
        <Link
          to="/library"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("book.back")}
        </Link>

        <div className="grid md:grid-cols-[300px_1fr] gap-8 lg:gap-12">
          {/* Sidebar Column */}
          <div className="space-y-6">
            <BookCover src={book.cover} alt={book.title} />

            <div className="space-y-3">
              <Button variant="secondary" className="w-full">
                <Bookmark className="mr-2 h-4 w-4" />
                {t("book.addToCollection")}
              </Button>
              <Button
                variant="outline"
                className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("book.remove")}
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{book.author}</p>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">{t("book.synopsis")}</h3>
              <p className="text-muted-foreground">{book.description}</p>
            </div>

            <Separator className="my-8" />

            {book.isbn && (
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                  {t("book.isbn")}
                </span>
                <span className="font-medium">{book.isbn}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
