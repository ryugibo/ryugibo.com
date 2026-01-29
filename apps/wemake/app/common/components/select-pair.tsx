import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ryugibo/ui";
import { useState } from "react";

interface SelectPairProps {
  name: string;
  required: boolean;
  label: string;
  description: string;
  placeholder?: string;
  options: readonly { readonly label: string; readonly value: string }[];
}

export default function SelectPair({
  name,
  required,
  label,
  description,
  placeholder,
  options,
}: SelectPairProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2 flex flex-col items-start">
      <Label className="flex flex-col items-start" onClick={() => setOpen(true)}>
        {label}
        <small className="text-muted-foreground">{description}</small>
      </Label>
      <Select open={open} onOpenChange={setOpen} name={name} required={required}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
