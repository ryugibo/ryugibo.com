import { Button } from "@ryugibo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ryugibo/ui/card";
import { Input } from "@ryugibo/ui/input";
import { Label } from "@ryugibo/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ryugibo/ui/select";
import { Textarea } from "@ryugibo/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { useTranslation } from "../../../common/hooks/use-translation";
import AppLayout from "../../../common/layouts/app-layout";
import { BookCover } from "../components/book-cover";

export default function AddBookPage() {
  const navigate = useNavigate();
  const [coverUrl, setCoverUrl] = useState("");
  const { t } = useTranslation();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("addBook.success"));
    navigate("/library");
  };

  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-6 p-4 max-w-2xl mx-auto w-full">
        <div>
          <Link
            to="/books/search"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("addBook.back")}
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            {t("addBook.title")}
          </h1>
          <p className="text-muted-foreground">{t("addBook.subtitle")}</p>
        </div>

        <form onSubmit={handleSave}>
          <Card>
            <CardHeader>
              <CardTitle>{t("addBook.details")}</CardTitle>
              <CardDescription>{t("addBook.detailsDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="title">{t("addBook.form.title")}</Label>
                  <Input id="title" placeholder="e.g. The Pragmatic Programmer" required />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="author">{t("addBook.form.author")}</Label>
                  <Input id="author" placeholder={t("addBook.placeholder.author")} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t("addBook.form.status")}</Label>
                  <Select defaultValue="toread">
                    <SelectTrigger>
                      <SelectValue placeholder={t("addBook.placeholder.status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reading">{t("addBook.status.reading")}</SelectItem>
                      <SelectItem value="toread">{t("addBook.status.toread")}</SelectItem>
                      <SelectItem value="completed">{t("addBook.status.completed")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages">{t("addBook.form.pages")}</Label>
                  <Input id="pages" type="number" placeholder="e.g. 352" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownership">{t("addBook.form.ownership")}</Label>
                  <Select defaultValue="owned">
                    <SelectTrigger>
                      <SelectValue placeholder={t("addBook.placeholder.ownership")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">{t("addBook.ownership.owned")}</SelectItem>
                      <SelectItem value="borrowed">{t("addBook.ownership.borrowed")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">{t("addBook.form.source")}</Label>
                  <Input id="source" placeholder="e.g. Bookstore, Library" />
                </div>
              </div>

              <div className="space-y-4">
                <Label>{t("addBook.form.cover")}</Label>
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-[120px]">
                    <BookCover
                      src={
                        coverUrl ||
                        "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=300&h=450"
                      }
                      alt="Book Cover Preview"
                      className={!coverUrl ? "opacity-50" : ""}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="cover" className="text-xs font-normal text-muted-foreground">
                      {t("addBook.form.coverUrl")}
                    </Label>
                    <Input
                      id="cover"
                      placeholder="https://..."
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("addBook.placeholder.cover")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("addBook.form.description")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("addBook.placeholder.desc")}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              {t("addBook.cancel")}
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> {t("addBook.save")}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
