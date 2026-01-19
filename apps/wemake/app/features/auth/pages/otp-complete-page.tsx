import { Button } from "@ryugibo/ui/button";
import { Form, Link } from "react-router";
import InputPair from "~/common/components/input-pair";

export const meta = () => {
  return [{ title: "Verify OTP | wemake" }];
};

export default function OtpCompletePage() {
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant="ghost" asChild className="absolute top-8 right-8">
        <Link to="/auth/join">Join</Link>
      </Button>
      <div className="flex flex-col items-center justify-center w-full max-w-md gap-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Confirm OTP</h1>
          <p className="text-sm text-muted-foreground">
            Enter the OTP code sent to your meail address.
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
            placeholder="i.e wemake@example.com"
          />
          <InputPair
            label="OTP"
            description="Enter the OTP code sent to your email address"
            id="otp"
            name="otp"
            required
            type="number"
            placeholder="i.e 1234"
          />
          <Button type="submit" className="w-full">
            Log in
          </Button>
        </Form>
      </div>
    </div>
  );
}
