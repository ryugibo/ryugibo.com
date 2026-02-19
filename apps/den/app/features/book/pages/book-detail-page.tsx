import { Badge, Button, Label, LoadingButton } from "@ryugibo/ui";
import { ArrowLeft, Check, Layers, Plus } from "@ryugibo/ui/icons";
import { resolveAppUrl } from "@ryugibo/utils";
import { useEffect } from "react";
import { Form, Link, redirect, useActionData, useNavigate, useNavigation } from "react-router";
import { toast } from "sonner";
import { createSSRClient } from "~/supabase.server.ts";
import { BookCover } from "../components/book-cover.tsx";
import { GroupingRequestButton } from "../components/grouping-request-button.tsx";
import { createGroupingRequest } from "../grouping-request-mutation.ts";
import { addBook, removeBook } from "../mutation.ts";
import type { Route } from "./+types/book-detail-page.ts";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);
  const { isbn } = params;

  if (!isbn) {
    throw new Response("ISBN is required", { status: 400 });
  }

  const { data: userData } = await supabase.auth.getUser();

  // 1. Fetch book details from API
  // biome-ignore lint/suspicious/noExplicitAny: API response type is loose
  let bookDetails: any;
  try {
    const apiUrl = `${resolveAppUrl("den-api")}/isbn/${isbn}.json`;
    console.log("Fetching book details from:", apiUrl);
    const res = await fetch(apiUrl);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Response("Book not found", { status: 404 });
      }
      throw new Error(`Failed to fetch book details: ${res.statusText}`);
    }
    bookDetails = await res.json();
  } catch (error: unknown) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Error fetching book details:", error);
    throw new Response("Failed to load book details", { status: 500 });
  }

  // 2. Check if book is in user's library
  let inLibrary = false;
  if (userData.user) {
    const { data: existingBooks } = await supabase
      .from("profile_books")
      .select(`
        books!inner (
          isbn
        )
      `)
      .eq("profile_id", userData.user.id)
      .eq("books.isbn", isbn)
      .maybeSingle();

    inLibrary = !!existingBooks;
  }

  // 3. Fetch related editions (other books in same work)
  // biome-ignore lint/suspicious/noExplicitAny: db result type assumption
  let editions: any[] = [];

  const { data: bookInDb } = await supabase
    .from("books")
    .select("work_id, works(title)")
    .eq("isbn", isbn)
    .maybeSingle();

  if (bookInDb?.work_id) {
    const { data: workBooks } = await supabase
      .from("books")
      .select("isbn, title")
      .eq("work_id", bookInDb.work_id);

    if (workBooks) {
      editions = workBooks;
    }
  }

  return { book: bookDetails, inLibrary, editions, workTitle: bookInDb?.works?.title };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
  const { supabase } = createSSRClient(request);
  const { data: userData } = await supabase.auth.getUser();

  const formData = await request.formData();
  const actionType = formData.get("_action");
  const isbn = params.isbn;
  if (!isbn) {
    throw new Response("ISBN is required", { status: 400 });
  }

  if (actionType === "add") {
    if (!userData.user) return redirect("/login");
    await addBook({
      supabase,
      profile_id: userData.user.id,
      isbn,
      title: formData.get("title") as string,
      source: "kyobo", // Default or form input
    });
    return { success: true, action: "add" };
  } else if (actionType === "remove") {
    if (!userData.user) return redirect("/login");
    await removeBook({
      supabase,
      profile_id: userData.user.id,
      isbn,
    });
    return { success: true, action: "remove" };
  } else if (actionType === "request_grouping") {
    if (!userData.user) return redirect("/login");

    const userMessage = formData.get("message") as string;
    const title = formData.get("currentTitle");
    const author = formData.get("currentAuthor");
    const publisher = formData.get("currentPublisher");
    const pubDate = formData.get("currentPubDate");

    const fullMessage = `${userMessage}\n\n[Book Info]\nTitle: ${title}\nAuthor: ${author}\nPublisher: ${publisher}\nPublished: ${pubDate}`;

    await createGroupingRequest({
      supabase,
      userId: userData.user.id,
      isbn,
      requestType: formData.get("requestType") as string,
      message: fullMessage,
    });
    return { success: true, action: "request_grouping" };
  }

  return null;
};

export default function BookDetailPage({ loaderData }: Route.ComponentProps) {
  const { book, inLibrary, editions, workTitle } = loaderData;
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      if (actionData.action === "add") toast.success("Added to library");
      if (actionData.action === "remove") toast.success("Removed from library");
      if (actionData.action === "request_grouping") {
        toast.success("Request submitted");
      }
    }
  }, [actionData]);

  if (!book) {
    return <div>Book not found</div>;
  }

  // Handle edition change
  const handleEditionChange = (newIsbn: string) => {
    navigate(`/books/${newIsbn}`);
  };

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <Button variant="ghost" asChild className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
        <Link to="/books/search" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Link>
      </Button>

      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        {/* Cover Image Placeholder */}
        <div className="space-y-4">
          <BookCover
            src={`${resolveAppUrl("den-api")}/cover/${book.EA_ISBN}.jpg`}
            alt={book.TITLE}
            className="w-full h-auto aspect-2/3 shadow-lg border"
          />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {inLibrary ? (
              <Form method="post">
                <input type="hidden" name="_action" value="remove" />
                <LoadingButton
                  variant="outline"
                  className="w-full"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  <Check className="w-4 h-4 mr-2" />
                  In Library
                </LoadingButton>
              </Form>
            ) : (
              <Form method="post">
                <input type="hidden" name="_action" value="add" />
                <input type="hidden" name="title" value={book.TITLE} />
                <LoadingButton className="w-full" type="submit" isLoading={isSubmitting}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Library
                </LoadingButton>
              </Form>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{book.TITLE}</h1>
                {book.edition_info && (
                  <Badge variant="outline" className="mt-2 text-primary border-primary">
                    {book.edition_info}
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <Badge variant="outline">{book.PUBLISHER}</Badge>
              <span>ISBN: {book.EA_ISBN}</span>
              {book.PUBLISH_PREDATE && <span>Published: {book.PUBLISH_PREDATE}</span>}
            </div>
          </div>

          {/* Editions / Series Info */}
          {editions.length > 0 && (
            <div className="p-4 rounded-lg bg-muted/30 border">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-primary" />
                <h3 className="font-medium">Editions in "{workTitle}"</h3>
              </div>
              {/* Render Radio Group manually */}
              <div className="grid gap-2">
                {editions.map((edition: { isbn: string; title: string }) => (
                  <div key={edition.isbn} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={edition.isbn}
                      name="edition"
                      value={edition.isbn}
                      checked={edition.isbn === book.EA_ISBN}
                      onChange={() => handleEditionChange(edition.isbn)}
                      className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Label
                      htmlFor={edition.isbn}
                      className="text-sm cursor-pointer hover:underline"
                    >
                      {edition.title}{" "}
                      <span className="text-muted-foreground text-xs">({edition.isbn})</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grouping Request */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-1">Incorrect Metadata?</h3>
                <p className="text-sm text-muted-foreground">
                  Help us improve by requesting to group this book into a series or fix edition
                  links.
                </p>
              </div>
              <GroupingRequestButton
                book={{
                  isbn: book.isbn,
                  title: book.TITLE,
                  author: book.AUTHOR,
                  publisher: book.PUBLISHER,
                  publishDate: book.PUBLISH_PREDATE,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
