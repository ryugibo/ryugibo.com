import {
  Badge,
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from "@ryugibo/ui";
import { Search, Trash2 } from "@ryugibo/ui/icons";
import { resolveAppUrl } from "@ryugibo/utils";
import { useState } from "react";
import { data, Form, Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { removeBook } from "~/features/book/mutation.ts";
import { getProfileByUsername } from "~/features/profile/queries.ts";
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
  const { supabase, headers } = createSSRClient(request);
  let profile_id: string;
  let isOwnLibrary = false;
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    const profile = await getProfileByUsername({ supabase, username: "ryugibo" });
    if (!profile) {
      return { books: [], source: dataQuery.source, isOwnLibrary: false };
    }
    profile_id = profile.id;
    isOwnLibrary = false;
  } else {
    const { id } = userData.user;
    profile_id = id;
    isOwnLibrary = true;
  }

  console.log(profile_id);
  const books = await getLibrary({
    supabase,
    profile_id,
    keyword: dataQuery.keyword,
    source: dataQuery.source,
  });
  return data({ books, source: dataQuery.source, isOwnLibrary }, { headers });
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase, headers } = createSSRClient(request);
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error("User not found");
  }

  const formData = await request.formData();
  const isbn = formData.get("isbn") as string;

  await removeBook({
    supabase,
    profile_id: userData.user.id,
    isbn,
  });

  return data({}, { headers });
};

export default function LibraryPage({ loaderData }: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { books, source, isOwnLibrary } = loaderData;
  const [selectedGroup, setSelectedGroup] = useState<{
    type: "series" | "work";
    id: string;
    title: string;
    items: (typeof books)[number][];
  } | null>(null);

  const onClickFilter = (key: string, value: string) => {
    if (searchParams.get(key) === value) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }
    setSearchParams(searchParams);
  };
  const keyword = searchParams.get("keyword") || "";

  const getSourceLabel = (val: string) => {
    return BOOK_SOURCES.find((s) => s.value === val)?.label || val;
  };

  // Group books by series > work > book
  type BookItem = (typeof books)[number];

  type SeriesGroup = {
    type: "series";
    series: { id: string; title: string };
    items: BookItem[];
  };

  type WorkGroup = {
    type: "work";
    work: NonNullable<BookItem["books"]["works"]>;
    items: BookItem[];
  };

  type SingleBook = { type: "book"; item: BookItem };

  type DisplayItem = SeriesGroup | WorkGroup | SingleBook;

  const displayItems = books.reduce<DisplayItem[]>((acc, item) => {
    const work = item.books.works;
    const series = work?.series;

    if (series) {
      const existingGroup = acc.find(
        (group): group is SeriesGroup => group.type === "series" && group.series.id === series.id,
      );
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        acc.push({ type: "series", series, items: [item] });
      }
    } else if (work) {
      const existingGroup = acc.find(
        (group): group is WorkGroup => group.type === "work" && group.work.id === work.id,
      );
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        acc.push({ type: "work", work, items: [item] });
      }
    } else {
      acc.push({ type: "book", item });
    }
    return acc;
  }, []);

  // Sort items within groups
  displayItems.forEach((group) => {
    if (group.type === "series") {
      group.items.sort((a, b) => {
        const orderA = a.books.works?.series_order ?? Infinity;
        const orderB = b.books.works?.series_order ?? Infinity;
        return orderA - orderB;
      });
    }
  });

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
              defaultValue={keyword}
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
        {displayItems.map((entry) => {
          if (entry.type === "series") {
            const { series, items } = entry;
            // Use the first book's cover as representative
            const representBook = items[0];
            return (
              <button
                type="button"
                key={`series-${series.id}`}
                className="group relative block w-full text-left cursor-pointer"
                onClick={() =>
                  setSelectedGroup({ type: "series", id: series.id, title: series.title, items })
                }
              >
                <BookCover
                  src={`${resolveAppUrl("den-api")}/cover/${representBook.books.isbn}.jpg`}
                  alt={series.title}
                  className="mb-3"
                />
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-foreground truncate flex-1 pr-2">
                      {series.title}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                      Series
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{items.length} books</p>
                </div>
                {items.length > 0 && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Badge variant="outline" className="bg-background">
                      {items.length}
                    </Badge>
                  </div>
                )}
              </button>
            );
          } else if (entry.type === "work") {
            const { work, items } = entry;
            const representBook = items[0];
            return (
              <button
                type="button"
                key={`work-${work.id}`}
                className="group relative block w-full text-left cursor-pointer"
                onClick={() =>
                  setSelectedGroup({ type: "work", id: work.id, title: work.title, items })
                }
              >
                <BookCover
                  src={`${resolveAppUrl("den-api")}/cover/${representBook.books.isbn}.jpg`}
                  alt={work.title}
                  className="mb-3"
                />
                <div className="space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-foreground truncate flex-1 pr-2">
                      {work.title}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                      {items.length > 1
                        ? `${items.length} editions`
                        : getSourceLabel(representBook.source || "")}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {representBook.books.isbn}
                  </p>
                </div>
                {/* For now, just delete the first book if single, or show nothing if multiple (safe default) */}
                {items.length === 1 && (
                  <Form
                    method="post"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onSubmit={(e) => {
                      if (!isOwnLibrary) {
                        e.preventDefault();
                        toast.error(t("auth.loginRequired") || "로그인이 필요한 기능입니다.");
                      }
                    }}
                  >
                    <input type="hidden" name="isbn" value={representBook.books.isbn} />
                    <Button size="sm" variant="destructive" type="submit" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Form>
                )}
                {items.length > 1 && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Placeholder for handling multiple editions deletion/viewing */}
                    <Badge variant="outline" className="bg-background">
                      Grouped
                    </Badge>
                  </div>
                )}
              </button>
            );
          } else {
            const { item: book } = entry;
            return (
              <div key={`book-${book.books.isbn}`} className="group relative block">
                <Link to={`/books/${book.books.isbn}`} className="block">
                  <BookCover
                    src={`${resolveAppUrl("den-api")}/cover/${book.books.isbn}.jpg`}
                    alt={book.books.title}
                    className="mb-3"
                  />
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold text-foreground truncate flex-1 pr-2">
                        {book.books.title}
                      </h3>
                      <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                        {getSourceLabel(book.source || "")}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{book.books.isbn}</p>
                  </div>
                </Link>
                <Form
                  method="post"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onSubmit={(e) => {
                    if (!isOwnLibrary) {
                      e.preventDefault();
                      toast.error(t("auth.loginRequired") || "로그인이 필요한 기능입니다.");
                    }
                  }}
                >
                  <input type="hidden" name="isbn" value={book.books.isbn} />
                  <Button size="sm" variant="destructive" type="submit" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Form>
              </div>
            );
          }
        })}
      </div>
      <Dialog open={!!selectedGroup} onOpenChange={(open) => !open && setSelectedGroup(null)}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg md:max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedGroup?.title}
              {selectedGroup?.type === "work" && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({selectedGroup.items.length} Versions)
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 md:grid-cols-2">
            {selectedGroup?.items.map((item) => {
              // Dynamic Middle Truncation using Flexbox
              // Split title into Head (truncate) and Tail (fixed)
              const TAIL_LENGTH = 10;
              const hasTail = item.books.title.length > 20;
              const titleHead = hasTail
                ? item.books.title.slice(0, -TAIL_LENGTH)
                : item.books.title;
              const titleTail = hasTail ? item.books.title.slice(-TAIL_LENGTH) : "";

              return (
                <div
                  key={item.books.isbn}
                  className="flex items-start gap-4 p-2 border rounded-lg overflow-hidden"
                >
                  <BookCover
                    src={`${resolveAppUrl("den-api")}/cover/${item.books.isbn}.jpg`}
                    alt={item.books.title}
                    className="w-16 h-auto shrink-0 shadow-sm"
                  />
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/books/${item.books.isbn}`}
                        className="hover:underline flex w-full items-baseline gap-0.5"
                        title={item.books.title}
                      >
                        <h4 className="font-semibold text-sm truncate shrink">{titleHead}</h4>
                        {hasTail && (
                          <h4 className="font-semibold text-sm flex-none">{titleTail}</h4>
                        )}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {selectedGroup.type === "series" && item.books.works?.series_order
                          ? `Vol. ${item.books.works.series_order}`
                          : item.books.isbn}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px]">
                          {getSourceLabel(item.source || "")}
                        </Badge>
                      </div>
                    </div>

                    <Form
                      method="post"
                      className="self-end w-full"
                      onSubmit={(e) => {
                        if (!isOwnLibrary) {
                          e.preventDefault();
                          toast.error(t("auth.loginRequired") || "로그인이 필요한 기능입니다.");
                        } else {
                          if (!confirm("Are you sure you want to delete this book?")) {
                            e.preventDefault();
                          }
                        }
                      }}
                    >
                      <input type="hidden" name="isbn" value={item.books.isbn} />
                      <Button
                        size="sm"
                        variant="destructive"
                        type="submit"
                        className="w-full h-8 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </Form>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
