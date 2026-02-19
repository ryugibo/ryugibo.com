import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  LoadingButton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useDebounce,
} from "@ryugibo/ui";
import { ChevronLeft, ChevronRight, Edit2, Plus, Search } from "@ryugibo/ui/icons";
import { useEffect, useState } from "react";
import { Form, Link, useNavigation, useSubmit } from "react-router";

interface ContentManagerProps {
  works: {
    id: string;
    title: string;
    series_id?: string | null;
    series_order?: number | null;
    books?: { id: number; title: string; edition_info?: string | null }[];
  }[];
  series: { id: string; title: string }[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  currentTab: string;
  q: string;
}

export function ContentManager({ works, series, pagination, currentTab, q }: ContentManagerProps) {
  const [searchTerm, setSearchTerm] = useState(q);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSearching =
    navigation.location && new URLSearchParams(navigation.location.search).has("q");

  // Sync internal state with URL prop if it changes externally
  useEffect(() => {
    setSearchTerm(q);
  }, [q]);

  // Trigger search on debounce
  useEffect(() => {
    // Only submit if the value is different from URL and not just initial load
    if (debouncedSearchTerm !== q) {
      const formData = new FormData();
      formData.set("q", debouncedSearchTerm);
      formData.set("tab", currentTab);
      formData.set("page", "1"); // Reset to page 1 on search
      submit(formData, { method: "get" });
    }
  }, [debouncedSearchTerm, currentTab, q, submit]);

  // Works grouped by Series (Client-side grouping of the *fetched request*)
  // Since server returns flattened works, we need to regroup them for display if in series mode
  const worksBySeries = works.reduce(
    (acc, work) => {
      if (work.series_id) {
        if (!acc[work.series_id]) acc[work.series_id] = [];
        acc[work.series_id].push(work);
      }
      return acc;
    },
    {} as Record<string, typeof works>,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${currentTab}...`}
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isSearching && (
            <div className="absolute right-2 top-2 text-xs text-muted-foreground animate-pulse">
              Searching...
            </div>
          )}
        </div>

        {currentTab === "series" ? <CreateSeriesDialog /> : <CreateWorkDialog />}
      </div>

      <Tabs defaultValue={currentTab} className="space-y-4">
        <TabsList>
          <Link
            to="?tab=series&page=1&q="
            className={currentTab === "series" ? "pointer-events-none" : ""}
          >
            <TabsTrigger
              value="series"
              data-state={currentTab === "series" ? "active" : "inactive"}
            >
              Series
            </TabsTrigger>
          </Link>
          <Link
            to="?tab=works&page=1&q="
            className={currentTab === "works" ? "pointer-events-none" : ""}
          >
            <TabsTrigger value="works" data-state={currentTab === "works" ? "active" : "inactive"}>
              Standalone Works
            </TabsTrigger>
          </Link>
        </TabsList>

        <TabsContent value="series" className="space-y-4 data-[state=active]:block hidden">
          {series.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No series found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {series.map((s) => (
                <Card key={s.id} className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium truncate pr-8" title={s.title}>
                      {s.title}
                    </CardTitle>
                    <EditSeriesDialog series={s} works={worksBySeries[s.id] || []} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">
                      {worksBySeries[s.id]?.length || 0} Works Linked
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="works" className="space-y-4 data-[state=active]:block hidden">
          {works.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No standalone works found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {works.map((w) => (
                <Card key={w.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium truncate pr-4" title={w.title}>
                      {w.title}
                    </CardTitle>
                    <EditWorkDialog work={w} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground">Standalone Work</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => {
                const newPage = pagination.page - 1;
                submit({ page: newPage.toString(), q, tab: currentTab }, { method: "get" });
              }}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => {
                const newPage = pagination.page + 1;
                submit({ page: newPage.toString(), q, tab: currentTab }, { method: "get" });
              }}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Tabs>
    </div>
  );
}

function CreateSeriesDialog() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (!isSubmitting) setOpen(false);
  }, [isSubmitting]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Create Series
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Series</DialogTitle>
          <DialogDescription>Add a new series to the database.</DialogDescription>
        </DialogHeader>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="_action" value="create_series" />
          <div className="space-y-2">
            <Label htmlFor="title">Series Title</Label>
            <Input id="title" name="title" required placeholder="e.g. Harry Potter" />
          </div>
          <DialogFooter>
            <LoadingButton type="submit" isLoading={isSubmitting}>
              Create
            </LoadingButton>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CreateWorkDialog() {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (!isSubmitting) setOpen(false);
  }, [isSubmitting]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Create Work
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Work</DialogTitle>
          <DialogDescription>Add a new standalone work.</DialogDescription>
        </DialogHeader>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="_action" value="create_work" />
          <div className="space-y-2">
            <Label htmlFor="title">Work Title</Label>
            <Input id="title" name="title" required placeholder="e.g. The Hobbit" />
          </div>
          <DialogFooter>
            <LoadingButton type="submit" isLoading={isSubmitting}>
              Create
            </LoadingButton>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EditSeriesDialog({
  series,
  works,
}: {
  series: { id: string; title: string };
  // biome-ignore lint/suspicious/noExplicitAny: explicit any
  works: any[];
}) {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Sort works by series_order
  const sortedWorks = [...works].sort(
    (a, b) => (a.series_order ?? Infinity) - (b.series_order ?? Infinity),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 absolute top-2 right-2">
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Series: {series.title}</DialogTitle>
          <DialogDescription>Update series details and manage works.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 1. Edit Series Title */}
          <Form method="post" className="border-b pb-4">
            <input type="hidden" name="_action" value="update_series" />
            <input type="hidden" name="seriesId" value={series.id} />
            <div className="grid gap-2">
              <Label htmlFor="title">Series Title</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="title"
                  name="title"
                  defaultValue={series.title}
                  required
                  className="flex-1"
                />
                <LoadingButton
                  type="submit"
                  size="sm"
                  isLoading={isSubmitting}
                  className="w-auto shrink-0"
                >
                  Save Title
                </LoadingButton>
              </div>
            </div>
          </Form>

          {/* 2. List & Edit Works */}
          <div>
            <h3 className="text-sm font-medium mb-3">Works in Series</h3>
            {sortedWorks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No works linked to this series.</p>
            ) : (
              <div className="space-y-3">
                {sortedWorks.map((work) => (
                  <EditWorkInline key={work.id} work={work} isSeriesView />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: explicit any
function EditWorkDialog({ work }: { work: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Work</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <EditWorkInline work={work} isSeriesView={false} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: explicit any
function EditWorkInline({ work, isSeriesView }: { work: any; isSeriesView: boolean }) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="bg-muted/30 p-3 rounded-md border text-sm">
      <Form method="post" className="space-y-3">
        <input type="hidden" name="_action" value="update_work" />
        <input type="hidden" name="workId" value={work.id} />

        <div className="flex gap-3 items-end">
          <div className="flex-1 space-y-1">
            <Label htmlFor={`w-title-${work.id}`}>Work Title</Label>
            <Input id={`w-title-${work.id}`} name="title" defaultValue={work.title} required />
          </div>
          {isSeriesView && (
            <div className="w-20 space-y-1">
              <Label htmlFor={`w-order-${work.id}`}>Order</Label>
              <Input
                id={`w-order-${work.id}`}
                name="seriesOrder"
                type="number"
                step="0.1"
                defaultValue={work.series_order ?? ""}
                placeholder="#"
              />
            </div>
          )}
          <LoadingButton
            type="submit"
            size="sm"
            variant="secondary"
            isLoading={isSubmitting}
            className="w-auto shrink-0"
          >
            Update
          </LoadingButton>
        </div>
      </Form>

      {/* List Books inside Work */}
      {work.books && work.books.length > 0 && (
        <div className="mt-3 pl-4 border-l-2 border-muted">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Linked Books & Editions</p>
          <div className="space-y-2">
            {/* biome-ignore lint/suspicious/noExplicitAny: explicit any */}
            {work.books.map((book: any) => (
              <Form key={book.id} method="post" className="flex gap-2 items-center">
                <input type="hidden" name="_action" value="update_book_edition" />
                <input type="hidden" name="bookId" value={book.id} />
                <div className="text-xs truncate w-1/3" title={book.title}>
                  {book.title}
                </div>
                <Input
                  name="editionInfo"
                  defaultValue={book.edition_info || ""}
                  placeholder="Edition Info (e.g. 20th Anniv.)"
                  className="h-7 text-xs flex-1"
                />
                <Button size="sm" variant="ghost" className="h-7 px-2" type="submit">
                  <Edit2 className="h-3 w-3" />
                </Button>
              </Form>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
