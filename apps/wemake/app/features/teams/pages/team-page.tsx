import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@ryugibo/ui";
import { Form } from "react-router";
import z from "zod";
import { Hero } from "~/common/components/hero.tsx";
import InputPair from "~/common/components/input-pair.tsx";
import { createSSRClient } from "~/supabase-client.ts";
import { getTeamById } from "../queries.ts";
import type { Route } from "./+types/team-page";

export const meta = () => {
  return [{ title: "Team Details | wemake" }, { description: "View team details" }];
};

const paramsSchema = z.object({
  id: z.coerce.number(),
});
export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Error("Invalid params");
  }
  const { id } = data;
  const { supabase } = createSSRClient(request);
  const team = await getTeamById({ supabase, id: Number(id) });
  return { team };
};

export default function TeamPage({ loaderData }: Route.ComponentProps) {
  const { team } = loaderData;
  return (
    <div className="space-y-20">
      <Hero title={`Join ${team.team_leader.name}'s team`} />
      <div className="grid grid-cols-6 gap-40 items-start">
        <div className="col-span-4 grid grid-cols-4 gap-5">
          {[
            {
              title: "Product Name",
              value: team.product_name,
            },
            {
              title: "Stage",
              value: team.product_stage,
            },
            {
              title: "Team Size",
              value: team.team_size,
            },
            {
              title: "Available Equity",
              value: team.equity_split,
            },
          ].map((item) => (
            <Card key={item.value}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="font-bold text-2xl capitalize">
                <p>{item.value}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Looking for
              </CardTitle>
            </CardHeader>
            <CardContent className="font-bold text-lg">
              <ul className="list-disc list-inside">
                {team.roles.split(",").map((role) => (
                  <li key={role}>{role}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Idea description
              </CardTitle>
            </CardHeader>
            <CardContent className="font-medium text-lg">
              <p>{team.product_description}</p>
            </CardContent>
          </Card>
        </div>
        <aside className="col-span-2 border rounded-lg shadow-sm p-5 space-y-5">
          <div className="flex gap-5">
            <Avatar className="size-14">
              {team.team_leader.avatar && <AvatarImage src={team.team_leader.avatar} />}
              <AvatarFallback>{team.team_leader.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4 className="text-lg font-medium">{team.team_leader.name}</h4>
              <Badge variant="secondary" className="capitalize">
                {team.team_leader.role}
              </Badge>
            </div>
          </div>
          <Form className="space-y-5">
            <InputPair
              label="Introduce Yourself?"
              description="Tell us about yourself"
              name="introduction"
              type="text"
              id="introduction"
              required
              textarea
              placeholder="i.e. I'm a software engineer with 5 years of experience"
            />
            <Button type="submit" className="w-full">
              Get in touch
            </Button>
          </Form>
        </aside>
      </div>
    </div>
  );
}
