import { AspectRatio, Button, Card } from "@ryugibo/ui";
import { Plus } from "@ryugibo/ui/icons";
import { Link } from "react-router";
import { useTranslation } from "../../../common/hooks/use-translation.ts";
import AppLayout from "../../../common/layouts/app-layout.tsx";
import type { Route } from "./+types/collections-page";

export default function CollectionsPage(_: Route.ComponentProps) {
  const { t } = useTranslation();

  const collections = [
    {
      id: 1,
      name: "UX Design",
      count: 12,
      color: "bg-pink-500",
      cover:
        "https://images.unsplash.com/photo-1586717791821-3f44a5638d28?auto=format&fit=crop&q=80&w=300&h=300",
    },
    {
      id: 2,
      name: "Programming",
      count: 24,
      color: "bg-blue-500",
      cover:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=300&h=300",
    },
    {
      id: 3,
      name: "Sci-Fi",
      count: 8,
      color: "bg-purple-500",
      cover:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=300&h=300",
    },
    {
      id: 4,
      name: "Favorites",
      count: 5,
      color: "bg-yellow-500",
      cover:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=300&h=300",
    },
  ];

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-6 p-4">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t("collections.title")}
            </h1>
            <p className="text-muted-foreground mt-1">{t("collections.subtitle")}</p>
          </div>
          <Button className="shadow-lg">
            <Plus className="mr-2 h-4 w-4" /> {t("collections.new")}
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.id}`}
              className="group relative block transition-all hover:-translate-y-1"
            >
              <Card className="overflow-hidden border-muted-foreground/10 bg-card">
                <div className="relative">
                  <AspectRatio ratio={1 / 1}>
                    <img
                      src={collection.cover}
                      alt={collection.name}
                      className="w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent" />
                  </AspectRatio>
                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${collection.color} mb-2 shadow-[0_0_8px_rgba(0,0,0,0.5)] border border-white/20`}
                    ></span>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {collection.count}
                      {t("collections.booksCount")}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
