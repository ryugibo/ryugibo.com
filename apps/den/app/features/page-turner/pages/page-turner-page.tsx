import { DateTime } from "luxon";
import { supabaseAdmin as supabase } from "~/supabase-client.ts";
import type { Route } from "./+types/page-turner-page";

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 404 });
  }
  const header = request.headers.get("PageTurner");
  if (!header || header !== "PageTurner") {
    return new Response(null, { status: 404 });
  }
  const weekAgo = DateTime.now().minus({ weeks: 1 });

  const { data, error } = await supabase
    .from("profile_books")
    .select(`
    profile_id,
    book:books!book_id(title),
    updated_at
  `)
    .eq("read_state", "reading")
    .lte("updated_at", weekAgo.toISO())
    .order("profile_id")
    .order("updated_at", { ascending: true });

  if (error) {
    console.log(error);
    return new Response(null, { status: 404 });
  }

  const targets = data.reduce(
    (acc: { profile_id: string; book_title: string }[], current) => {
      if (!current.profile_id || !current.book?.title) {
        return acc;
      }
      if (acc.find((item) => item.profile_id === current.profile_id)) {
        return acc;
      }
      acc.push({
        profile_id: current.profile_id,
        book_title: current.book.title,
      });
      return acc;
    },
    [] as { profile_id: string; book_title: string }[],
  );

  console.log(targets);
  // @todo: profile_id 유저에게 book_title에 대해서 알림 보내기

  return Response.json({ ok: true });
};
