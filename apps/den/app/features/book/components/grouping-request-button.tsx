import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  LoadingButton,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@ryugibo/ui";
import { Share2 } from "@ryugibo/ui/icons";
import { useState } from "react";
import { Form, useNavigation } from "react-router";

interface GroupingRequestButtonProps {
  book: {
    isbn: string;
    title: string;
    author: string;
    publisher: string;
    publishDate: string;
  };
}

export function GroupingRequestButton({ book }: GroupingRequestButtonProps) {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" &&
    navigation.formMethod === "POST" &&
    navigation.formData?.get("_action") === "request_grouping";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Request Grouping
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Book Grouping</DialogTitle>
          <DialogDescription>
            Suggest how this book should be grouped or corrected.
          </DialogDescription>
        </DialogHeader>
        <Form method="post" onSubmit={() => setOpen(false)}>
          <input type="hidden" name="_action" value="request_grouping" />
          <input type="hidden" name="currentTitle" value={book.title} />
          <input type="hidden" name="currentAuthor" value={book.author} />
          <input type="hidden" name="currentPublisher" value={book.publisher} />
          <input type="hidden" name="currentPubDate" value={book.publishDate} />

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="requestType">Request Type</Label>
              <Select name="requestType" defaultValue="series">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="series">Group into Series</SelectItem>
                  <SelectItem value="edition">Link as Edition</SelectItem>
                  <SelectItem value="other">Other Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Details</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Please describe the series name or correct edition link..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <LoadingButton type="submit" isLoading={isSubmitting}>
              Submit Request
            </LoadingButton>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
