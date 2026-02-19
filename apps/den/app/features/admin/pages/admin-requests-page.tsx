import { Badge } from "@ryugibo/ui";
import { useActionData } from "react-router";
import { toast } from "sonner";
import { createSSRClient } from "~/supabase.server.ts";
import { RequestReviewDialog } from "../components/request-review-dialog.tsx";
import {
  createWork,
  insertSeries,
  updateRequestStatus,
  updateWork,
  upsertBook,
} from "../mutation.ts";
import {
  getAllSeries,
  getAllWorks,
  getBookByIsbn,
  getBooksByIsbns,
  getPendingRequests,
} from "../queries.ts";
import type { Route } from "./+types/admin-requests-page.ts";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);

  // Fetch pending requests
  const requests = await getPendingRequests({ supabase });

  if (!requests) {
    throw new Response("Error fetching requests", { status: 500 });
  }

  // Enhance requests with book titles from local DB if available
  const isbns = requests.map((r) => r.book_isbn).filter((isbn): isbn is string => !!isbn);
  // No explicit any needed here as we define type implicitly or it's inferred correctly
  let bookMap: Record<string, string> = {};

  if (isbns.length > 0) {
    const books = await getBooksByIsbns({ supabase, isbns });

    if (books) {
      bookMap = books.reduce(
        (acc, book) => {
          acc[book.isbn] = book.title;
          return acc;
        },
        {} as Record<string, string>,
      );
    }
  }

  const enhancedRequests = requests.map((req) => ({
    ...req,
    book_title: bookMap[req.book_isbn] || "Unknown Title",
  }));

  // Need works and series for the dialog
  const works = await getAllWorks({ supabase });
  const series = await getAllSeries({ supabase });

  return { requests: enhancedRequests, works: works || [], series: series || [] };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase } = createSSRClient(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");
  const requestId = formData.get("requestId") as string;
  const bookIsbn = formData.get("bookIsbn") as string;
  const bookTitle = formData.get("bookTitle") as string;

  if (!requestId) return { success: false, error: "Missing request ID" };

  try {
    if (actionType === "approve") {
      await updateRequestStatus({ supabase, requestId, status: "approved" });
      return { success: true, action: "approve" };
    } else if (actionType === "reject") {
      await updateRequestStatus({ supabase, requestId, status: "rejected" });
      return { success: true, action: "reject" };
    } else if (actionType === "create_work_and_link") {
      const workTitle = formData.get("workTitle") as string;
      const existingWorkId = formData.get("existingWorkId") as string;

      let workId = existingWorkId;

      // 1. Create Work if NOT existing
      if (!workId) {
        const work = await createWork({ supabase, title: workTitle });
        if (!work) throw new Error("Work creation failed");
        workId = work.id;
      }

      // 2. Ensure Book Exists (Upsert) & Link
      await upsertBook({
        supabase,
        isbn: bookIsbn,
        title: bookTitle,
        work_id: workId,
      });

      // 3. Resolve Request
      await updateRequestStatus({ supabase, requestId, status: "approved" });
      return { success: true, action: "create_work" };
    } else if (actionType === "create_series_and_link") {
      const seriesTitle = formData.get("seriesTitle") as string;
      const existingSeriesId = formData.get("existingSeriesId") as string;

      let seriesId = existingSeriesId;

      // 1. Create Series if NOT existing
      if (!seriesId) {
        const series = await insertSeries({ supabase, title: seriesTitle });
        if (!series) throw new Error("Series creation failed");
        seriesId = series.id;
      }

      // 2. Find Book's Work
      const book = await getBookByIsbn({ supabase, isbn: bookIsbn });

      let workId = book?.work_id;
      const bookTitleStr =
        (formData.get("bookTitle") as string) || book?.title || `Work for ${bookIsbn}`;

      // If no work exists for this book, we must create one to link to the series
      if (!workId) {
        // Create a work with the book's title (or fallback)
        const newWorkTitle = bookTitleStr;
        const newWork = await createWork({ supabase, title: newWorkTitle, series_id: seriesId });
        if (!newWork) throw new Error("Auto-work creation failed");
        workId = newWork.id;

        // Link book to this new work
        await upsertBook({
          supabase,
          isbn: bookIsbn,
          title: newWorkTitle,
          work_id: workId,
        });
      } else {
        // Just update existing work to point to series
        await updateWork({ supabase, id: workId, series_id: seriesId });
      }

      // 3. Resolve Request
      await updateRequestStatus({ supabase, requestId, status: "approved" });
      return { success: true, action: "create_series" };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error" };
  }

  return null;
};

export default function AdminRequestsPage({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;
  const { requests, works, series } = loaderData;
  const actionData = useActionData<typeof action>();

  if (actionData?.success) {
    toast.success(`Request ${actionData.action}d successfully`);
  }

  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-lg bg-card">
          No pending requests.
        </div>
      ) : (
        <div className="relative w-full overflow-auto border rounded-xl bg-card">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Type
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  ISBN
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Message
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Date
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                    <Badge variant="outline">{req.request_type}</Badge>
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-mono text-xs">
                    {req.book_isbn}
                  </td>
                  <td
                    className="p-4 align-middle [&:has([role=checkbox])]:pr-0 max-w-[300px] truncate"
                    title={req.message || ""}
                  >
                    {req.message}
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-xs text-muted-foreground">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                    <div className="flex justify-end gap-2">
                      <RequestReviewDialog request={req} works={works} series={series} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
