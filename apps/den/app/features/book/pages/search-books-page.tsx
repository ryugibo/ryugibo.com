import { Button, Input } from "@ryugibo/ui";
import { ArrowRight, Plus, Search } from "@ryugibo/ui/icons";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "../../../common/hooks/use-translation.ts";
import { BookCover } from "../components/book-cover.tsx";
import type { Route } from "./+types/search-books-page";

export default function SearchBooksPage(_: Route.ComponentProps) {
  const [query, setQuery] = useState("");
  const { t } = useTranslation();

  // Mock global database
  const allBooks = [
    {
      id: "isbn-1",
      title: "The Pragmatic Programmer",
      author: "David Thomas, Andrew Hunt",
      cover:
        "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=300&h=450",
      description: "Your journey to mastery.",
      year: "2019",
    },
    {
      id: "isbn-2",
      title: "Clean Architecture",
      author: "Robert C. Martin",
      cover:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300&h=450",
      description: "A Craftsman's Guide to Software Structure and Design.",
      year: "2017",
    },
    {
      id: "isbn-3",
      title: "Site Reliability Engineering",
      author: "Niall Richard Murphy et al.",
      cover:
        "https://images.unsplash.com/photo-1555239167-a22ff5d3be9e?auto=format&fit=crop&q=80&w=300&h=450",
      description: "How Google Runs Production Systems.",
      year: "2016",
    },
    {
      id: "isbn-4",
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      cover:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300&h=450",
      description: "The bible of algorithms.",
      year: "2009",
    },
  ];

  const results = query
    ? allBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const handleAdd = (bookTitle: string) => {
    toast.success(`${bookTitle} ${t("search.toast.added")}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 max-w-4xl mx-auto w-full">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          {t("search.title")}
        </h1>
        <p className="text-muted-foreground">{t("search.subtitle")}</p>
      </header>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search.placeholder")}
            className="pl-9 h-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          {query ? `${t("search.results")} (${results.length})` : t("search.startTyping")}
        </h2>
        <Link to="/books/add">
          <Button variant="outline" size="sm">
            {t("search.cantFind")} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {results.map((book) => (
          <div
            key={book.id}
            className="group flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="w-[80px] shrink-0">
              <BookCover src={book.cover} alt={book.title} aspectRatio={2 / 3} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg leading-tight text-foreground">
                    {book.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {book.author} • {book.year}
                  </p>
                </div>
                <Button size="sm" onClick={() => handleAdd(book.title)}>
                  <Plus className="mr-2 h-4 w-4" /> {t("search.add")}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{book.description}</p>
            </div>
          </div>
        ))}
        {query && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
            <p>
              {t("search.noResults")} "{query}"
            </p>
            <Button variant="link" asChild className="mt-2">
              <Link to="/books/add">{t("search.addManually")}</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
