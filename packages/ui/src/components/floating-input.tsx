import { cn } from "@ryugibo/ui";
import { Eye, EyeOff } from "@ryugibo/ui/icons";
import type { InputHTMLAttributes } from "react";
import { useId, useState } from "react";

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function FloatingInput({ label, error, className, id, type, ...rest }: FloatingInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="relative">
      <input
        id={inputId}
        {...rest}
        type={inputType}
        placeholder=" "
        className={cn(
          "peer w-full rounded-md border border-input bg-background px-3 pt-5 pb-2 text-sm text-foreground outline-none",
          "transition-[border-color,box-shadow] duration-200",
          "focus:border-ring focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isPassword && "pr-10",
          error && "border-destructive focus:border-destructive focus:ring-destructive",
          className,
        )}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "pointer-events-none absolute left-3 top-2 origin-top-left",
          "transition-all duration-200 ease-out",
          "scale-75 translate-y-0 text-sm text-muted-foreground",
          "peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2",
          "peer-focus:scale-75 peer-focus:translate-y-0 peer-focus:text-primary",
          error && "text-destructive peer-focus:text-destructive",
        )}
      >
        {label}
      </label>
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      )}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export { FloatingInput };
