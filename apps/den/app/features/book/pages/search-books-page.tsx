import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ryugibo/ui";
import { Plus, Search } from "@ryugibo/ui/icons";
import { resolveAppUrl } from "@ryugibo/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "../../../common/hooks/use-translation.ts";
import { supabase } from "../../../supabase.client.ts";
import { BOOK_SOURCES, type BookSource } from "../../library/constant.ts";
import type { Route } from "./+types/search-books-page.ts";

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

export default function SearchBooksPage(_: Route.ComponentProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NlBookDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedBook, setSelectedBook] = useState<NlBookDocument | null>(null);
  const [selectedSource, setSelectedSource] = useState<BookSource>("kyobo");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { t } = useTranslation();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const fetchUrl = `${resolveAppUrl("den-api")}/search?title=${encodeURIComponent(query)}`;
      const res = await fetch(fetchUrl);
      if (!res.ok) throw new Error(`Search failed: ${res.status} ${res.statusText}`);

      const data: NlSearchResponse = await res.json();
      setResults(data.docs || []);
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

  const handleAdd = async () => {
    if (!selectedBook) return;

    try {
      // 1. books 테이블에 upsert (ISBN 기준)
      const { data: bookData, error: bookError } = await supabase
        .from("books")
        .upsert(
          {
            isbn: selectedBook.EA_ISBN,
            title: selectedBook.TITLE,
            author: selectedBook.AUTHOR,
          },
          { onConflict: "isbn" },
        )
        .select("id")
        .single();

      if (bookError) throw bookError;

      // 2. profile_books에 추가
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const { error: profileBookError } = await supabase.from("profile_books").insert({
        profile_id: user.id,
        book_id: bookData.id,
        source: selectedSource,
        comment: "",
      });

      if (profileBookError) throw profileBookError;

      toast.success(`"${selectedBook.TITLE}" 추가 완료!`);
      setDialogOpen(false);
    } catch (error) {
      console.error("Add error:", error);
      toast.error("책 추가 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          {t("search.title")}
        </h1>
        <p className="text-muted-foreground">{t("search.subtitle")}</p>
      </header>

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
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "검색 중..." : "검색"}
        </Button>
      </div>

      <div className="flex items-center py-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          {searched ? `검색 결과 (${results.length}건)` : "책 제목으로 검색하세요"}
        </h2>
      </div>

      <div className="grid gap-3">
        {results.map((book) => (
          <div
            key={book.EA_ISBN}
            className="group flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-base leading-tight text-foreground">
                    {book.TITLE}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {book.AUTHOR} · {book.PUBLISHER}
                  </p>
                  {book.EA_ISBN && (
                    <p className="text-xs text-muted-foreground mt-0.5">ISBN: {book.EA_ISBN}</p>
                  )}
                </div>
                <Button size="sm" onClick={() => openAddDialog(book)}>
                  <Plus className="mr-1 h-4 w-4" /> 추가
                </Button>
              </div>
            </div>
          </div>
        ))}
        {searched && results.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <p>"{query}"에 대한 검색 결과가 없습니다.</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>구매처 선택</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{selectedBook.TITLE}</p>
                <p className="text-sm text-muted-foreground">{selectedBook.AUTHOR}</p>
              </div>
              <div className="space-y-2">
                <Label>구매처</Label>
                <Select
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
              <Button className="w-full" onClick={handleAdd}>
                추가
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
