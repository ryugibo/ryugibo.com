import { VercelInviteUserEmail } from "@ryugibo/emails/vercel-invite-user";
import { Resend } from "resend";
import type { Route } from "./+types/welcome-page";

const client = new Resend(process.env.RESEND_API_KEY);

export const loader = async (_: Route.LoaderArgs) => {
  const { data, error } = await client.emails.send({
    from: "ryugibo <onboarding@resend.dev>",
    to: [process.env.EMAIL || ""],
    subject: "Welcome to Wemake",
    react: <VercelInviteUserEmail username={"Wemake"} />,
  });
  return Response.json({ data, error });
};
