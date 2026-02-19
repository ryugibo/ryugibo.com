import { useActionData } from "react-router";
import { toast } from "sonner";
import { createSSRClient } from "~/supabase.server.ts";
import { ContentManager } from "../components/content-manager.tsx";
import {
  createWork,
  insertSeries,
  updateBookEdition,
  updateSeries,
  updateWork,
} from "../mutation.ts";
import {
  getBooksByWorkIds,
  getSeriesWithCount,
  getStandaloneWorksWithCount,
  getWorksBySeriesIds,
} from "../queries.ts";
import type { Route } from "./+types/admin-content-page.ts";

const PAGE_SIZE = 12;

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { supabase } = createSSRClient(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const currentTab = url.searchParams.get("tab") || "series"; // 'series' or 'works' (standalone)

  // Fetch Logic based on Tab
  type SeriesData = { id: string; title: string };
  type WorkData = {
    id: string;
    title: string;
    series_id: string | null;
    series_order: number | null;
    books?: { id: number; title: string; edition_info: string | null; work_id: string | null }[];
  };

  let seriesData: SeriesData[] = [];
  let worksData: WorkData[] = [];
  let totalCount = 0;

  if (currentTab === "series") {
    // 1. Fetch Series matching query
    const { data, count } = await getSeriesWithCount({ supabase, page, pageSize: PAGE_SIZE, q });
    seriesData = data || [];
    totalCount = count || 0;

    // 2. Fetch Works for these series
    if (seriesData.length > 0) {
      const seriesIds = seriesData.map((s) => s.id);
      const works = await getWorksBySeriesIds({ supabase, seriesIds });

      // 3. Fetch Books for these works
      if (works && works.length > 0) {
        const workIds = works.map((w) => w.id);
        const books = await getBooksByWorkIds({ supabase, workIds });

        // Attach books to works
        worksData = works.map((w) => ({
          ...w,
          books: books?.filter((b) => b.work_id === w.id) || [],
        }));
      } else {
        worksData = works || [];
      }
    }
  } else {
    // Standalone Works Tab
    const { data: works, count } = await getStandaloneWorksWithCount({
      supabase,
      page,
      pageSize: PAGE_SIZE,
      q,
    });

    // Attach books to standalone works
    const worksList = works || [];
    if (worksList.length > 0) {
      const workIds = worksList.map((w) => w.id);
      const books = await getBooksByWorkIds({ supabase, workIds });

      worksData = worksList.map((w) => ({
        ...w,
        books: books?.filter((b) => b.work_id === w.id) || [],
      }));
    } else {
      worksData = [];
    }

    totalCount = count || 0;
  }

  return {
    series: seriesData,
    works: worksData,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total: totalCount,
      totalPages: Math.ceil(totalCount / PAGE_SIZE),
    },
    currentTab,
    q,
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const { supabase } = createSSRClient(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");

  try {
    if (actionType === "update_work") {
      const workId = formData.get("workId") as string;
      const title = formData.get("title") as string;
      const seriesOrderStr = formData.get("seriesOrder") as string;
      const seriesOrder = seriesOrderStr ? parseFloat(seriesOrderStr) : null;

      await updateWork({ supabase, id: workId, title, series_order: seriesOrder });
      return { success: true, action: "update" };
    } else if (actionType === "update_series") {
      const seriesId = formData.get("seriesId") as string;
      const title = formData.get("title") as string;

      await updateSeries({ supabase, id: seriesId, title });
      return { success: true, action: "update" };
    } else if (actionType === "update_book_edition") {
      const bookId = formData.get("bookId") as string;
      const editionInfo = formData.get("editionInfo") as string;

      await updateBookEdition({ supabase, id: parseInt(bookId, 10), edition_info: editionInfo });
      return { success: true, action: "update_edition" };
    } else if (actionType === "create_series") {
      const title = formData.get("title") as string;
      await insertSeries({ supabase, title });
      return { success: true, action: "create_series" };
    } else if (actionType === "create_work") {
      const title = formData.get("title") as string;
      await createWork({ supabase, title });
      return { success: true, action: "create_work" };
    }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error" };
  }

  return null;
};

export default function AdminContentPage({ loaderData }: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();

  if (actionData?.success) {
    toast.success(`Action ${actionData.action} successful`);
  }

  if (actionData?.error) {
    toast.error(`Action failed: ${actionData.error}`);
  }

  return (
    <ContentManager
      works={loaderData.works}
      series={loaderData.series}
      pagination={loaderData.pagination}
      currentTab={loaderData.currentTab}
      q={loaderData.q}
    />
  );
}
