import { Button } from "@ryugibo/ui/button";
import { Form, Link } from "react-router";
import InputPair from "~/common/components/input-pair.tsx";

export const meta = () => {
  return [{ title: "OTP Start | wemake" }];
};

export default function OtpStartPage() {
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to="/auth/join">Join</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Log in with OTP</h1>
          <p className="text-sm text-muted-foreground">
            We will send you a 4-digit code to log in to your account.
          </p>
        </div>
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
          <Button type="submit" className="w-full">
            Send OTP
          </Button>
        </Form>
      </div>
    </div>
  );
}
