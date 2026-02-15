import { Badge, Button, cn, Input } from "@ryugibo/ui";
import { Search } from "@ryugibo/ui/icons";
import { data, Form, useSearchParams } from "react-router";
import z from "zod";
import { createSSRClient } from "~/supabase.server.ts";
import { useTranslation } from "../../../common/hooks/use-translation.ts";
import { BookCover } from "../../book/components/book-cover.tsx";
import { BOOK_SOURCES } from "../constant.ts";
import { getLibrary } from "../queries.ts";
import type { Route } from "./+types/library-page";

const searchParamsSchema = z.object({
  keyword: z.string().optional(),
  source: z.enum(BOOK_SOURCES.map((s) => s.value)).optional(),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { success, data: dataQuery } = searchParamsSchema.safeParse(
    Object.fromEntries(url.searchParams),
  );
  if (!success) {
    throw data({
      error_code: "invalid_search_params",
      message: "Invalid search parameters",
    });
  }
  const { supabase } = createSSRClient(request);
  const books = await getLibrary(supabase, {
    keyword: dataQuery.keyword,
    source: dataQuery.source,
  });
  return {
    books,
    source: dataQuery.source,
  };
};

export default function LibraryPage({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { books, source } = loaderData;

  const onClickFilter = (key: string, value: string) => {
    if (searchParams.get(key) === value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    setSearchParams(searchParams);
  };

  const getSourceLabel = (val: string) => {
    return BOOK_SOURCES.find((s) => s.value === val)?.label || val;
  };

  return (
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
            {source && <Input type="hidden" name="source" value={source} />}
            <Input
              type="text"
              name="keyword"
              placeholder={t("library.searchPlaceholder")}
              className="pl-8"
            />
          </Form>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {BOOK_SOURCES.map((item) => (
          <Button
            key={item.value}
            variant="secondary"
            onClick={() => onClickFilter("source", item.value)}
            className={cn(source === item.value && "bg-primary text-primary-foreground")}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {books.map((book) => (
          <div key={book.book_id} className="group relative block">
            <BookCover src={book.cover} alt={book.title} className="mb-3" />
            <div className="space-y-1">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-foreground truncate flex-1 pr-2">
                  {book.title}
                </h3>
                <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                  {getSourceLabel(book.source || "")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
