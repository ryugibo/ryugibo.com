import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  LoadingButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ryugibo/ui";
import { ChevronDown, ChevronUp, Plus, Search, Trash2 } from "@ryugibo/ui/icons";
import { resolveAppUrl } from "@ryugibo/utils";
import { useEffect, useState } from "react";
import { data, Form, redirect, useActionData, useNavigation } from "react-router";
import { toast } from "sonner";
import { supabase } from "~/supabase.client.ts";
import { createSSRClient } from "~/supabase.server.ts";
import { useTranslation } from "../../../common/hooks/use-translation.ts";
import { BOOK_SOURCES, type BookSource } from "../../library/constant.ts";
import { addBook, removeBook } from "../mutation.ts";
import { getWorksByIsbns } from "../queries.ts";
import type { Route } from "./+types/search-books-page.ts";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase, headers } = createSSRClient(request);
  const { data: userData, error: errorUser } = await supabase.auth.getUser();
  if (errorUser) {
    console.log(errorUser);
    return redirect("/?error=login_required", { headers });
  }

  // Fetch user's existing books (ISBNs)
  const { data: profileBooks } = await supabase
    .from("profile_books")
    .select(`
      books!inner (
        isbn
      )
    `)
    .eq("profile_id", userData.user.id);

  const userBookIsbns = new Set(profileBooks?.map((pb) => pb.books.isbn) || []);

  return data({ userBookIsbns: Array.from(userBookIsbns) }, { headers });
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase, headers } = createSSRClient(request);
  const { data: dataUser, error: errorUser } = await supabase.auth.getUser();
  if (errorUser) {
    throw new Error("User not found");
  }

  const formData = await request.formData();
  const {
    user: { id: profile_id },
  } = dataUser;

  const action = formData.get("_action") as string;
  const isbn = formData.get("isbn") as string;

  if (action === "remove") {
    await removeBook({
      supabase,
      profile_id,
      isbn,
    });
    return data({ success: true, action: "remove", isbn }, { headers });
  } else {
    await addBook({
      supabase,
      profile_id,
      isbn,
      title: formData.get("title") as string,
      source: formData.get("source") as BookSource,
    });
    return data({ success: true, action: "add", isbn }, { headers });
  }
};

interface NlBookDocument {
  TITLE: string;
  AUTHOR: string;
  PUBLISHER: string;
  EA_ISBN: string;
  PUBLISH_PREDATE: string;
}

interface NlSearchResponse {
  TOTAL_COUNT: string;
  docs: NlBookDocument[];
}

export default function SearchBooksPage({ loaderData }: Route.ComponentProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NlBookDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedBook, setSelectedBook] = useState<NlBookDocument | null>(null);
  const [selectedSource, setSelectedSource] = useState<BookSource>("kyobo");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userBooks, setUserBooks] = useState<string[]>(loaderData.userBookIsbns);

  // Grouping state
  const [isbnToWorkId, setIsbnToWorkId] = useState<Record<string, string>>({});
  const [workInfo, setWorkInfo] = useState<Record<string, { title: string }>>({});
  const [expandedWorks, setExpandedWorks] = useState<Record<string, boolean>>({});

  const { t } = useTranslation();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const isBookInLibrary = (isbn: string) => userBooks.includes(isbn);
  const isSubmitting = navigation.state === "submitting";
  const formData = navigation.formData;
  const submittingAction = formData?.get("_action") as string | undefined;
  const submittingIsbn = formData?.get("isbn") as string | undefined;

  // Handle successful book addition/removal
  useEffect(() => {
    if (actionData?.success && actionData.action === "add") {
      setDialogOpen(false);
      setUserBooks((prev) => [...prev, actionData.isbn]);
      toast.success(t("search.toast.added") || "책을 서재에 추가했습니다.");
    } else if (actionData?.success && actionData.action === "remove") {
      setUserBooks((prev) => prev.filter((isbn) => isbn !== actionData.isbn));
    }
  }, [actionData, t]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    setIsbnToWorkId({});
    setWorkInfo({});

    try {
      const fetchUrl = `${resolveAppUrl("den-api")}/search?title=${encodeURIComponent(query)}`;
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error(`Search failed: ${res.status} ${res.statusText}`);

      const data: NlSearchResponse = await res.json();
      const docs = data.docs || [];
      setResults(docs);

      // Check works for these ISBNs
      const isbns = docs.map((d) => d.EA_ISBN).filter(Boolean);
      if (isbns.length > 0) {
        const works = await getWorksByIsbns({ supabase, isbns });
        if (works) {
          const newIsbnToWorkId: Record<string, string> = {};
          const newWorkInfo: Record<string, { title: string }> = {};

          works.forEach((w) => {
            if (w.work_id && w.works) {
              newIsbnToWorkId[w.isbn] = w.work_id;
              newWorkInfo[w.work_id] = { title: w.works.title };
            }
          });
          setIsbnToWorkId(newIsbnToWorkId);
          setWorkInfo(newWorkInfo);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("검색 중 오류가 발생했습니다.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const openAddDialog = (book: NlBookDocument) => {
    setSelectedBook(book);
    setSelectedSource("kyobo");
    setDialogOpen(true);
  };

  const toggleWorkExpand = (workId: string) => {
    setExpandedWorks((prev) => ({ ...prev, [workId]: !prev[workId] }));
  };

  // Grouping logic for rendering
  const displayedItems: Array<
    | { type: "book"; book: NlBookDocument }
    | { type: "work"; workId: string; books: NlBookDocument[] }
  > = [];
  const processedWorkIds = new Set<string>();

  results.forEach((book) => {
    const workId = isbnToWorkId[book.EA_ISBN];
    if (workId) {
      if (!processedWorkIds.has(workId)) {
        // Find all books in this work from results
        const booksInWork = results.filter((b) => isbnToWorkId[b.EA_ISBN] === workId);
        displayedItems.push({ type: "work", workId, books: booksInWork });
        processedWorkIds.add(workId);
      }
    } else {
      displayedItems.push({ type: "book", book });
    }
  });

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          {t("search.title")}
        </h1>
        <p className="text-muted-foreground">{t("search.subtitle")}</p>
      </header>
      {/* ... Search Input (unchanged) ... */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="책 제목을 입력하세요"
            className="pl-9 h-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
        <LoadingButton onClick={handleSearch} isLoading={loading} className="w-auto">
          검색
        </LoadingButton>
      </div>

      <div className="flex items-center py-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          {searched ? `검색 결과 (${results.length}건)` : "책 제목으로 검색하세요"}
        </h2>
      </div>

      <div className="grid gap-3">
        {displayedItems.map((item) => {
          if (item.type === "work") {
            const { workId, books: groupBooks } = item;
            const info = workInfo[workId];
            const isExpanded = expandedWorks[workId];

            return (
              <div key={`work-${workId}`} className="rounded-lg border bg-card overflow-hidden">
                <button
                  type="button"
                  className="flex w-full text-left items-center gap-4 p-4 hover:bg-accent/50 transition-colors cursor-pointer outline-none focus:bg-accent/50"
                  onClick={() => toggleWorkExpand(workId)}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Work</Badge>
                          <h3 className="font-semibold text-base leading-tight text-foreground">
                            {info?.title || groupBooks[0].TITLE}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {groupBooks[0].EA_ISBN}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {groupBooks.length} editions found
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </button>
                {isExpanded && (
                  <div className="border-t bg-muted/30 p-2 space-y-2">
                    {groupBooks.map((book) => (
                      <BookItem
                        key={book.EA_ISBN}
                        book={book}
                        isBookInLibrary={isBookInLibrary}
                        openAddDialog={openAddDialog}
                        isSubmitting={isSubmitting}
                        submittingAction={submittingAction}
                        submittingIsbn={submittingIsbn}
                        nested
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <BookItem
                key={item.book.EA_ISBN}
                book={item.book}
                isBookInLibrary={isBookInLibrary}
                openAddDialog={openAddDialog}
                isSubmitting={isSubmitting}
                submittingAction={submittingAction}
                submittingIsbn={submittingIsbn}
              />
            );
          }
        })}
        {searched && results.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <p>"{query}"에 대한 검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* ... Dialog Content (unchanged) ... */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>구매처 선택</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <Form method="post">
              <input type="hidden" name="_action" value="add" />
              <input type="hidden" name="isbn" value={selectedBook.EA_ISBN} />
              <input type="hidden" name="title" value={selectedBook.TITLE} />
              <div className="space-y-4">
                <div>
                  <p className="font-medium">{selectedBook.TITLE}</p>
                  <p className="text-sm text-muted-foreground">{selectedBook.AUTHOR}</p>
                </div>
                <div className="space-y-2">
                  <Label>구매처</Label>
                  <Select
                    name="source"
                    value={selectedSource}
                    onValueChange={(v) => setSelectedSource(v as typeof selectedSource)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BOOK_SOURCES.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <LoadingButton isLoading={isSubmitting && submittingAction === "add"}>
                  추가
                </LoadingButton>
              </div>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Extracted BookItem component for reuse
function BookItem({
  book,
  isBookInLibrary,
  openAddDialog,
  isSubmitting,
  submittingAction,
  submittingIsbn,
  nested = false,
}: {
  book: NlBookDocument;
  isBookInLibrary: (isbn: string) => boolean;
  openAddDialog: (book: NlBookDocument) => void;
  isSubmitting: boolean;
  submittingAction?: string;
  submittingIsbn?: string;
  nested?: boolean;
}) {
  const inLibrary = isBookInLibrary(book.EA_ISBN);

  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${nested ? "bg-background border-none shadow-none" : ""}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-base leading-tight text-foreground">{book.TITLE}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {book.AUTHOR} · {book.PUBLISHER}
            </p>
            {book.EA_ISBN && (
              <p className="text-xs text-muted-foreground mt-0.5">ISBN: {book.EA_ISBN}</p>
            )}
          </div>
          {inLibrary ? (
            <Form method="post">
              <input type="hidden" name="_action" value="remove" />
              <input type="hidden" name="isbn" value={book.EA_ISBN} />
              <LoadingButton
                size="sm"
                variant="destructive"
                type="submit"
                isLoading={
                  isSubmitting && submittingAction === "remove" && submittingIsbn === book.EA_ISBN
                }
                className="w-auto"
              >
                <Trash2 className="mr-1 h-4 w-4" /> 삭제
              </LoadingButton>
            </Form>
          ) : (
            <Button size="sm" onClick={() => openAddDialog(book)}>
              <Plus className="mr-1 h-4 w-4" /> 추가
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
