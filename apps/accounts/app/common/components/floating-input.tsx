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
          "peer w-full rounded-md border border-input bg-background px-3 pt-5 pb-2 text-sm text-foreground outline-none",
          "transition-[border-color,box-shadow] duration-200",
          "focus:border-ring focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus:border-destructive focus:ring-destructive",
          className,
        )}
      />
      <label
        htmlFor={inputId}
        className={cn(
          // top fixed at top-2, only transform/color animate (GPU-accelerated)
          "pointer-events-none absolute left-3 top-2 origin-top-left",
          "transition-all duration-200 ease-out",
          // Floated-up state (has value): scale down from top-left
          "scale-75 translate-y-0 text-sm text-muted-foreground",
          // Empty & unfocused: restore to center (scale back up, translateY down)
          "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2",
          // Focused: float back up
          "peer-focus:scale-75 peer-focus:translate-y-0 peer-focus:text-primary",
          error && "text-destructive peer-focus:text-destructive",
        )}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
