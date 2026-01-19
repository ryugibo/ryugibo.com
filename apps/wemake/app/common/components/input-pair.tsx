import { Input } from "@ryugibo/ui/input";
import { Label } from "@ryugibo/ui/label";
import { Textarea } from "@ryugibo/ui/textarea";
import type { InputHTMLAttributes } from "react";

export default function InputPair({
  label,
  description,
  textarea = false,
  ...rest
}: {
  label: string;
  description: string;
  textarea?: boolean;
} & InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>) {
  return (
    <div className="space-y-2 flex flex-col items-start">
      <Label htmlFor={rest.id} className="flex flex-col items-start">
        {label}
        <small className="text-muted-foreground">{description}</small>
      </Label>
      {textarea ? (
        <Textarea rows={4} className="field-sizing-fixed resize-none" {...rest} />
      ) : (
        <Input {...rest} />
      )}
    </div>
  );
}
