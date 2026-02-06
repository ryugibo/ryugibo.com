import { PageTurnerEmail } from "@ryugibo/emails/page-turner-email";
import { DateTime } from "luxon";
import { Resend } from "resend";
import { supabaseAdmin as supabase } from "~/supabase-client.ts";
import type { Route } from "./+types/page-turner-page";

const client = new Resend(process.env.RESEND_API_KEY);

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 404 });
  }
  const header = request.headers.get("PageTurner");
  if (!header || header !== "PageTurner") {
    return new Response(null, { status: 404 });
  }
  const weekAgo = DateTime.now().minus({ weeks: 1 });

  const { data: dataDb, error: errorDb } = await supabase
    .from("profile_books")
    .select(
      `
      profile:profiles!profile_id(
        username,
        email
      ),
      book:books!book_id(
        id,
        title
      ),
      updated_at
    `,
    )
    .eq("read_state", "reading")
    .lte("updated_at", weekAgo.toISO())
    .order("profile_id")
    .order("updated_at", { ascending: true });

  if (errorDb) {
    console.log(errorDb);
    return new Response(null, { status: 404 });
  }

  const targets = dataDb.reduce(
    (acc: { email: string; username: string; book_title: string; book_id: number }[], current) => {
      if (!current.profile?.email || !current.book?.title) {
        return acc;
      }
      if (acc.find((item) => item.username === current.profile?.username)) {
        return acc;
      }
      acc.push({
        email: current.profile.email,
        username: current.profile.username,
        book_title: current.book.title,
        book_id: current.book.id,
      });
      return acc;
    },
    [] as { email: string; username: string; book_title: string; book_id: number }[],
  );

  for (const target of targets) {
    const { error } = await client.emails.send({
      from: "Den <den@noreply.ryugibo.com>",
      to: [target.email],
      subject: `${target.book_title}, 뒷이야기가 궁금하지 않으신가요? 👀`,
      react: (
        <PageTurnerEmail
          username={target.username}
          book_title={target.book_title}
          url={`${process.env.BASE_URL}/book/${target.book_id}`}
          coverUrl={`https://github.com/ryugibo.png`} // @TODO: replace real cover url fetched from api
        />
      ),
    });
    if (error) {
      console.log(error);
    }
  }

  return Response.json({ ok: true });
};
