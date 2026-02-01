import { Button } from "@ryugibo/ui";
import { DotIcon, EyeIcon, HeartIcon } from "@ryugibo/ui/icons";
import { DateTime } from "luxon";
import { data } from "react-router";
import { z } from "zod";
import { Hero } from "~/common/components/hero.tsx";
import { createSSRClient } from "~/supabase-client.ts";
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
  const { supabase } = createSSRClient(request);
  const idea = await getIdea({ supabase, id: dataId.ideaId });
  if (!idea) {
    throw data({ error_code: "idea_not_found", message: "Idea not found" }, { status: 404 });
  }
  return { idea };
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
        <Button size="lg">Claim idea now &rarr;</Button>
      </div>
    </div>
  );
}
