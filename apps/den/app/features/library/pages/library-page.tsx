import { Badge } from "@ryugibo/ui/badge";
import { Input } from "@ryugibo/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ryugibo/ui/tabs";
import { Search } from "lucide-react";
import { data, Form, Link } from "react-router";
import z from "zod";
import { useTranslation } from "../../../common/hooks/use-translation";
import AppLayout from "../../../common/layouts/app-layout";
import { BookCover } from "../../book/components/book-cover";
import { READ_STATE } from "../constant";
import { getLibrary } from "../queries";
import type { Route } from "./+types/library-page";

const searchParamsSchema = z.object({
  keyword: z.string().optional(),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { success, data: dataKeyword } = searchParamsSchema.safeParse(
    Object.fromEntries(url.searchParams),
  );
  if (!success) {
    throw data({
      error_code: "invalid_search_params",
      message: "Invalid search parameters",
    });
  }
  const books = await getLibrary({ keyword: dataKeyword.keyword });
  return {
    books,
  };
};

export default function LibraryPage({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { books } = loaderData;

  const categories = ["all", ...READ_STATE];

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-6 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t("library.title")}
            </h1>
            <p className="text-muted-foreground mt-1">{t("library.subtitle")}</p>
          </div>
          <div className="relative w-full md:w-64">
            <Form>
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                name="keyword"
                placeholder={t("library.searchPlaceholder")}
                className="pl-8"
              />
            </Form>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat}>
                {t(`library.filter.${cat}`)}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="space-y-4">
              <div className="flex flex-col">
                {books
                  .filter((book) => cat === "all" || book.read_state === cat)
                  .map((book) => (
                    <Link
                      key={book.book_id}
                      to={`/library/${book.book_id}`}
                      className="group relative block transition-all hover:-translate-y-1"
                    >
                      {book.cover && (
                        <BookCover src={book.cover} alt={book.title} className="mb-3" />
                      )}
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-semibold text-foreground truncate flex-1 pr-2 group-hover:text-primary transition-colors">
                            {book.title}
                          </h3>
                          <Badge
                            variant={book.read_state === "reading" ? "default" : "secondary"}
                            className="text-[10px] px-1.5 h-5"
                          >
                            {t(`library.filter.${book.read_state}`)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                      </div>
                    </Link>
                  ))}
              </div>
              {books.filter((book) => cat === "all" || book.read_state === cat).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  {t("library.noBooks")}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
}
