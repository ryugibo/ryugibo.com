import { Button, cn } from "@ryugibo/ui";
import { LoaderCircleIcon } from "@ryugibo/ui/icons";

type LoadingButtonProps = {
  isLoading: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function LoadingButton({ isLoading, className, ...props }: LoadingButtonProps) {
  return (
    <Button type="submit" className={cn("w-full", className)} disabled={isLoading} {...props}>
      {isLoading ? <LoaderCircleIcon className="animate-spin" /> : props.children}
    </Button>
  );
}

export { LoadingButton };
