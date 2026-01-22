import { Badge } from "@ryugibo/ui/badge";
import { Button } from "@ryugibo/ui/button";
import { Progress } from "@ryugibo/ui/progress";
import { Separator } from "@ryugibo/ui/separator";
import { ArrowLeft, Bookmark, BookOpen, Star, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router";
import { useTranslation } from "../../../common/hooks/use-translation";
import AppLayout from "../../../common/layouts/app-layout";
import { BookCover } from "../components/book-cover";

export default function BookDetailsPage() {
  const { bookId } = useParams();
  const { t } = useTranslation();

  // Dummy data
  const book = {
    id: bookId,
    title: "The Design of Everyday Things",
    author: "Don Norman",
    cover:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=300&h=450",
    description:
      "The Design of Everyday Things is a best-selling book by cognitive scientist and usability engineer Don Norman about how design serves as the communication between object and user, and how to optimize that conduit of communication in order to make the experience of using the object pleasurable.",
    isbn: "978-0465050659",
    publisher: "Basic Books",
    pages: 368,
    published: "2013",
    status: "reading",
    rating: 4.5,
    progress: 45, // percent
    ownership: "owned",
    source: "교보문고",
  };

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
              {book.status === "reading" && (
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("book.progress")}</span>
                    <span>{book.progress}%</span>
                  </div>
                  <Progress value={book.progress} className="h-2" />
                </div>
              )}

              <Button className="w-full" size="lg">
                <BookOpen className="mr-2 h-4 w-4" />
                {book.status === "reading" ? t("book.continue") : t("book.start")}
              </Button>
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
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  {t("book.aboutCopy")}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">{t("book.ownership")}</div>
                  <div className="font-medium text-right capitalize">
                    {t(`addBook.ownership.${book.ownership}`)}
                  </div>
                  <div className="text-muted-foreground">{t("book.source")}</div>
                  <div className="font-medium text-right">{book.source}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="py-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{book.author}</p>

            <div className="flex items-center gap-4 mb-8">
              <Badge
                variant={book.status === "reading" ? "default" : "secondary"}
                className="text-sm px-3 py-1"
              >
                {t(`library.filter.${book.status}`)}
              </Badge>
              <div className="flex items-center text-yellow-500 font-medium">
                <Star className="fill-current w-5 h-5 mr-1" />
                {book.rating}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">{t("book.synopsis")}</h3>
              <p className="text-muted-foreground leading-relaxed">{book.description}</p>
            </div>

            <Separator className="my-8" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                  {t("book.publisher")}
                </span>
                <span className="font-medium">{book.publisher}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                  {t("book.published")}
                </span>
                <span className="font-medium">{book.published}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                  {t("book.pages")}
                </span>
                <span className="font-medium">{book.pages}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
                  {t("book.isbn")}
                </span>
                <span className="font-medium">{book.isbn}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
