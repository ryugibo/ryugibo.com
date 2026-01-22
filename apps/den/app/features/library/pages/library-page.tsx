import { Badge } from "@ryugibo/ui/badge";
import { Input } from "@ryugibo/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ryugibo/ui/tabs";
import { Search } from "lucide-react";
import { Link } from "react-router";
import { useTranslation } from "../../../common/hooks/use-translation";
import AppLayout from "../../../common/layouts/app-layout";
import { BookCover } from "../../book/components/book-cover";

export default function LibraryPage() {
  const { t } = useTranslation();

  const books = [
    {
      id: 1,
      title: "The Design of Everyday Things",
      author: "Don Norman",
      cover:
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300&h=450",
      status: "reading",
    },
    {
      id: 2,
      title: "Refactoring UI",
      author: "Adam Wathan",
      cover:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300&h=450",
      status: "completed",
    },
    {
      id: 3,
      title: "Clean Code",
      author: "Robert C. Martin",
      cover:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=300&h=450",
      status: "toread",
    },
    {
      id: 4,
      title: "Zero to One",
      author: "Peter Thiel",
      cover:
        "https://images.unsplash.com/photo-1555239167-a22ff5d3be9e?auto=format&fit=crop&q=80&w=300&h=450",
      status: "reading",
    },
    {
      id: 5,
      title: "Atomic Habits",
      author: "James Clear",
      cover:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=300&h=450",
      status: "toread",
    },
    {
      id: 6,
      title: "Deep Work",
      author: "Cal Newport",
      cover:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300&h=450",
      status: "completed",
    },
  ];

  const categories = ["all", "reading", "toread", "completed"];

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
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder={t("library.searchPlaceholder")} className="pl-8" />
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {books
                  .filter((book) => cat === "all" || book.status === cat)
                  .map((book) => (
                    <Link
                      key={book.id}
                      to={`/library/${book.id}`}
                      className="group relative block transition-all hover:-translate-y-1"
                    >
                      <BookCover src={book.cover} alt={book.title} className="mb-3" />
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-semibold text-foreground truncate flex-1 pr-2 group-hover:text-primary transition-colors">
                            {book.title}
                          </h3>
                          <Badge
                            variant={book.status === "reading" ? "default" : "secondary"}
                            className="text-[10px] px-1.5 h-5"
                          >
                            {t(`library.filter.${book.status}`)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                      </div>
                    </Link>
                  ))}
              </div>
              {books.filter((book) => cat === "all" || book.status === cat).length === 0 && (
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
