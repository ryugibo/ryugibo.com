import { Button } from "@ryugibo/ui";
import { DotIcon, EyeIcon, HeartIcon } from "@ryugibo/ui/icons";
import { parseZodError, resolveParentPath } from "@ryugibo/utils";
import { DateTime } from "luxon";
import { data, Form, redirect } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { claimIdea } from "../mutations.ts";
import { getIdea } from "../queries.ts";
import type { Route } from "./+types/idea-page";

export const meta = ({
  loaderData: {
    idea: { id, idea },
  },
}: Route.MetaArgs) => {
  return [{ title: `Idea #${id}: ${idea} | wemake` }, { name: "description", content: idea }];
};

const paramsSchema = z.object({
  ideaId: z.coerce.number(),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success: successId, data: dataId } = paramsSchema.safeParse(params);
  if (!successId) {
    throw data({ error_code: "idea_not_found", message: "Idea not found" }, { status: 404 });
  }
  const { supabase, headers } = createSSRClient(request);
  const idea = await getIdea({ supabase, id: dataId.ideaId });
  if (!idea) {
    throw data(
      { error_code: "idea_not_found", message: "Idea not found" },
      { status: 404, headers },
    );
  }
  if (idea.is_claimed) {
    const { pathname } = new URL(request.url);
    const redirectPath = resolveParentPath({ pathname, steps: 1 });
    return redirect(redirectPath, { headers });
  }

  return data({ idea }, { headers });
};

const formSchema = z.object({
  id: z.coerce.number(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { pathname } = new URL(request.url);
  const { supabase, headers, getAuthUser } = createSSRClient(request);

  const defaultReturn = {
    data: null,
    formError: null,
  };

  const user = await getAuthUser();
  if (!user) {
    return redirect(pathname, { headers });
  }
  const { id: claimed_by } = user;
  const {
    success: successForm,
    data: dataForm,
    error: errorZodForm,
  } = formSchema.safeParse(Object.fromEntries(await request.formData()));

  if (!successForm) {
    const formError = parseZodError(errorZodForm);
    return data({ ...defaultReturn, formError }, { headers });
  }
  const { id } = dataForm;
  await claimIdea({ supabase, id, claimed_by });
  return redirect(`/my/dashboard/ideas`, { headers });
};

export default function IdeaPage({ loaderData }: Route.ComponentProps) {
  const { idea } = loaderData;
  return (
    <div>
      <Hero title={`Idea #${idea.id}`} />
      <div className="max-w-screen-sm mx-auto flex flex-col items-center gap-10">
        <p className="italic text-center">{idea.idea}</p>
        <div className="flex items-center text-sm">
          <div className="flex items-center gap-1">
            <EyeIcon className="size-4" />
            <span>{idea.views}</span>
          </div>
          <DotIcon className="size-4" />
          <span>{DateTime.fromISO(idea.created_at).toRelative()}</span>
          <DotIcon className="size-4" />
          <Button variant="outline">
            <HeartIcon className="size-4" />
            <span>{idea.likes}</span>
          </Button>
        </div>
        {!idea.is_claimed && (
          <Form method="post">
            <input type="hidden" name="id" value={idea.id} />
            <Button size="lg">Claim idea now &rarr;</Button>
          </Form>
        )}
      </div>
    </div>
  );
}
