import { Button } from "@ryugibo/ui/button";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router";
import { useTranslation } from "../../../common/hooks/use-translation";
import AppLayout from "../../../common/layouts/app-layout";
import { BookCover } from "../../book/components/book-cover";

export default function CollectionDetailsPage() {
  const { collectionId } = useParams();
  const { t } = useTranslation();

  // Dummy data
  const collection = {
    id: collectionId,
    name: "UX Design",
    description: "사용자 경험 및 인터페이스 디자인 관련 도서",
    books: [
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
        id: 4,
        title: "Zero to One",
        author: "Peter Thiel",
        cover:
          "https://images.unsplash.com/photo-1555239167-a22ff5d3be9e?auto=format&fit=crop&q=80&w=300&h=450",
      },
    ],
  };

  const newLocal =
    "group flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-all cursor-pointer aspect-[2/3] text-muted-foreground hover:text-foreground";
  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-6 p-4">
        <header className="mb-6">
          <Link
            to="/collections"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("collections.details.back")}
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{collection.name}</h1>
              <p className="text-muted-foreground max-w-2xl">{collection.description}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" /> {t("collections.details.edit")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> {t("collections.details.delete")}
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {collection.books.map((book) => (
            <Link
              key={book.id}
              to={`/library/${book.id}`}
              className="group relative block transition-all hover:-translate-y-1"
            >
              <BookCover src={book.cover} alt={book.title} />
              <div className="mt-3 space-y-1">
                <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">{book.author}</p>
              </div>
            </Link>
          ))}
          <Link to="/books/search" className={newLocal}>
            <Plus className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">{t("collections.details.addBook")}</span>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
