import { Button } from "@ryugibo/ui/button";
import { Form, Link } from "react-router";
import InputPair from "~/common/components/input-pair.tsx";
import AuthButtons from "~/features/auth/components/auth-buttons.tsx";

export const meta = () => {
  return [{ title: "Login | wemake" }];
};

export default function LoginPage() {
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to="/auth/join">Join</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <h1 className="text-2xl font-semibold">Log in to your account</h1>
        <Form className="w-full space-y-4">
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
            Login
          </Button>
        </Form>
        <AuthButtons />
      </div>
    </div>
  );
}
