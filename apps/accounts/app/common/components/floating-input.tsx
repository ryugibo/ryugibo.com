import { cn } from "@ryugibo/ui";
import type { InputHTMLAttributes } from "react";
import { useId } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FloatingInput({
  label,
  error,
  className,
  id,
  ...rest
}: FloatingInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="relative">
      <input
        id={inputId}
        {...rest}
        placeholder=" "
        className={cn(
          // Fixed height — padding never changes, so input size is always stable
          "peer w-full rounded-md border border-input bg-background px-3 pt-5 pb-2 text-sm text-foreground outline-none",
          "transition-[border-color,box-shadow]",
          "focus:border-ring focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus:border-destructive focus:ring-destructive",
          className,
        )}
      />
      <label
        htmlFor={inputId}
        className={cn(
          // Always absolutely positioned — never affects input layout
          "pointer-events-none absolute left-3 origin-left transition-all duration-200 ease-out",
          // Default: label floated up (when input has value)
          "top-1.5 scale-75 text-sm font-medium text-muted-foreground",
          // Placeholder shown = input is empty & unfocused → label goes to center
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
          // Focused → label floats back up
          "peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:scale-75 peer-focus:text-primary",
          error && "text-destructive peer-focus:text-destructive",
        )}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
