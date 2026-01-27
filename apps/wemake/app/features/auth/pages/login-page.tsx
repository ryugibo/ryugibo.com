import { Button } from "@ryugibo/ui/button";
import { LoaderCircleIcon } from "@ryugibo/ui/icons";
import { Form, Link, useNavigation } from "react-router";
import InputPair from "~/common/components/input-pair.tsx";
import AuthButtons from "~/features/auth/components/auth-buttons.tsx";
import type { Route } from "./+types/login-page";

export const meta = () => {
  return [{ title: "Login | wemake" }];
};

export const action = async ({ request }: Route.ActionArgs) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  const formData = await request.formData();
  const _email = formData.get("email") as string;
  const _password = formData.get("password") as string;
  return {
    error: { message: "Error" },
  };
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to="/auth/join">Join</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">Log in to your account</h1>
        <Form method="post" className="w-full space-y-4">
          <InputPair
            label="Email"
            description="Enter your email"
            id="email"
            name="email"
            required
            type="email"
            placeholder="Enter your email"
          />
          <InputPair
            label="Password"
            description="Enter your password"
            id="password"
            name="password"
            required
            type="password"
            placeholder="Enter your password"
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircleIcon className="animate-spin" /> : "Login"}
          </Button>
          {actionData?.error && <p className="text-sm text-red-500">{actionData.error.message}</p>}
        </Form>
        <AuthButtons />
      </div>
    </div>
  );
}
