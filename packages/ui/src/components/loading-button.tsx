import { Button, type ButtonProps, cn } from "@ryugibo/ui";
import { LoaderCircleIcon } from "@ryugibo/ui/icons";

type LoadingButtonProps = {
  isLoading: boolean;
} & ButtonProps;

function LoadingButton({ isLoading, className, children, ...props }: LoadingButtonProps) {
  return (
    <Button type="submit" className={cn("w-full", className)} disabled={isLoading} {...props}>
      {isLoading ? <LoaderCircleIcon className="animate-spin" /> : children}
    </Button>
  );
}

export { LoadingButton };
