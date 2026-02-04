import { redirect } from "react-router";
import { z } from "zod";
import { createSSRClient } from "~/supabase-client.ts";
import { seeNotification } from "../mutations.ts";
import type { Route } from "./+types/notification-page";

const paramsSchema = z.object({
  id: z.coerce.number(),
});

export const action = async ({ params, request }: Route.ActionArgs) => {
  const { success, data: dataParams } = paramsSchema.safeParse(params);
  if (!success) {
    return redirect("/notifications");
  }
  const { id } = dataParams;
  const { supabase, headers, getAuthUser } = createSSRClient(request);
  const user = await getAuthUser();
  if (!user) {
    return redirect("/notifications", { headers });
  }

  const { id: target_id } = user;

  await seeNotification({
    supabase,
    id,
    target_id,
  });
};
