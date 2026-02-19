import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Check } from "@ryugibo/ui/icons";
import { useState } from "react";
import { Form, useNavigation } from "react-router";

interface RequestReviewDialogProps {
  request: {
    id: string;
    request_type: string;
    message: string | null;
    book_isbn: string;
    book_title: string;
  };
  works: { id: string; title: string }[];
  series: { id: string; title: string }[];
}

export function RequestReviewDialog({ request, works, series }: RequestReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // State for Work Suggestion
  const [workInput, setWorkInput] = useState("");
  const debouncedWorkInput = useDebounce(workInput, 300);
  const [selectedWorkId, setSelectedWorkId] = useState<string>("");
  const workSuggestions = debouncedWorkInput
    ? works
        .filter((w) => w.title.toLowerCase().includes(debouncedWorkInput.toLowerCase()))
        .slice(0, 5)
    : [];

  // State for Series Suggestion
  const [seriesInput, setSeriesInput] = useState("");
  const debouncedSeriesInput = useDebounce(seriesInput, 300);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>("");
  const seriesSuggestions = debouncedSeriesInput
    ? series
        .filter((s) => s.title.toLowerCase().includes(debouncedSeriesInput.toLowerCase()))
        .slice(0, 5)
    : [];

  const closeDialog = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8">
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Review Grouping Request</DialogTitle>
          <DialogDescription>
            Process request for <span className="font-semibold">{request.book_title}</span> (
            {request.book_isbn})
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div className="text-sm bg-muted/50 p-3 rounded-md mb-4">
            <span className="font-semibold text-xs uppercase text-muted-foreground block mb-1">
              User Request ({request.request_type})
            </span>
            <div className="whitespace-pre-wrap">{request.message || "No details provided."}</div>
          </div>

          <Tabs defaultValue="work" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="work">Link to Work</TabsTrigger>
              <TabsTrigger value="series">Link to Series</TabsTrigger>
            </TabsList>

            {/* LINK TO WORK TAB */}
            <TabsContent value="work" className="space-y-4 py-4">
              <Form method="post" onSubmit={closeDialog} className="relative">
                <input type="hidden" name="requestId" value={request.id} />
                <input type="hidden" name="bookIsbn" value={request.book_isbn} />
                <input type="hidden" name="bookTitle" value={request.book_title} />
                <input type="hidden" name="_action" value="create_work_and_link" />
                <input type="hidden" name="existingWorkId" value={selectedWorkId} />

                <div className="space-y-2">
                  <Label htmlFor="workTitle">Link to Work</Label>
                  <div className="relative">
                    <Input
                      id="workTitle"
                      name="workTitle"
                      placeholder="Search or Create Work..."
                      value={workInput}
                      onChange={(e) => {
                        setWorkInput(e.target.value);
                        setSelectedWorkId(""); // Clear selection on edit
                      }}
                      autoComplete="off"
                      required
                    />
                    {/* Suggestions Dropdown */}
                    {!selectedWorkId && workSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full bg-popover border rounded-md shadow-md mt-1 overflow-hidden">
                        {workSuggestions.map((work) => (
                          <button
                            type="button"
                            key={work.id}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground outline-none"
                            onClick={() => {
                              setWorkInput(work.title);
                              setSelectedWorkId(work.id);
                            }}
                          >
                            <div className="font-medium">{work.title}</div>
                            <div className="text-xs text-muted-foreground">Existing Work</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedWorkId ? (
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Linking to existing work
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {workInput ? "Creating NEW Work" : "Search to link or type to create new."}
                    </p>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <LoadingButton type="submit" isLoading={isSubmitting} disabled={!workInput}>
                    {selectedWorkId ? "Link to Existing" : "Create & Link"}
                  </LoadingButton>
                </div>
              </Form>
            </TabsContent>

            {/* LINK TO SERIES TAB */}
            <TabsContent value="series" className="space-y-4 py-4">
              <Form method="post" onSubmit={closeDialog}>
                <input type="hidden" name="requestId" value={request.id} />
                <input type="hidden" name="bookIsbn" value={request.book_isbn} />
                <input type="hidden" name="_action" value="create_series_and_link" />
                <input type="hidden" name="existingSeriesId" value={selectedSeriesId} />

                <div className="space-y-2">
                  <Label htmlFor="seriesTitle">Link to Series</Label>
                  <div className="relative">
                    <Input
                      id="seriesTitle"
                      name="seriesTitle"
                      placeholder="Search or Create Series..."
                      value={seriesInput}
                      onChange={(e) => {
                        setSeriesInput(e.target.value);
                        setSelectedSeriesId(""); // Clear selection on edit
                      }}
                      autoComplete="off"
                      required
                    />
                    {/* Suggestions Dropdown */}
                    {!selectedSeriesId && seriesSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full bg-popover border rounded-md shadow-md mt-1 overflow-hidden">
                        {seriesSuggestions.map((s) => (
                          <button
                            type="button"
                            key={s.id}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer focus:bg-accent focus:text-accent-foreground outline-none"
                            onClick={() => {
                              setSeriesInput(s.title);
                              setSelectedSeriesId(s.id);
                            }}
                          >
                            <div className="font-medium">{s.title}</div>
                            <div className="text-xs text-muted-foreground">Existing Series</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedSeriesId ? (
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Linking to existing series
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {seriesInput
                        ? "Creating NEW Series"
                        : "Search to link or type to create new."}
                    </p>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <LoadingButton type="submit" isLoading={isSubmitting} disabled={!seriesInput}>
                    {selectedSeriesId ? "Link to Existing" : "Create & Link"}
                  </LoadingButton>
                </div>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="border-t pt-4 mt-2">
            <Form
              method="post"
              onSubmit={closeDialog}
              className="flex justify-between items-center"
            >
              <input type="hidden" name="requestId" value={request.id} />
              <input type="hidden" name="_action" value="reject" />
              <span className="text-xs text-muted-foreground">Invalid request?</span>
              <Button
                size="sm"
                variant="ghost"
                type="submit"
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                Reject Request
              </Button>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
