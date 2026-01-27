import { Button } from "@ryugibo/ui/button";
import { Form, Link } from "react-router";
import InputPair from "~/common/components/input-pair.tsx";
import AuthButtons from "~/features/auth/components/auth-buttons.tsx";
import type { Route } from "./+types/join-page";

export const meta = () => {
  return [{ title: "Join | wemake" }];
};

export default function JoinPage(_: Route.ComponentProps) {
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to="/auth/login">Login</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <Form className="w-full space-y-4">
          <InputPair
            label="Name"
            description="Enter your name"
            id="name"
            name="name"
            required
            type="text"
            placeholder="Enter your name"
          />
          <InputPair
            label="Username"
            description="Enter your username"
            id="username"
            name="username"
            required
            type="text"
            placeholder="Enter your username"
          />
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
          <Button type="submit" className="w-full">
            Create an account
          </Button>
        </Form>
        <AuthButtons />
      </div>
    </div>
  );
}
