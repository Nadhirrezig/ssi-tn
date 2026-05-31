import { cn } from "@/lib/utils";

type ContainerElement = "div" | "section" | "main" | "header" | "footer" | "article";

type ContainerProps = React.HTMLAttributes<HTMLElement> & {
  as?: ContainerElement;
};

export function Container({
  as: As = "div",
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <As
      className={cn(
        "w-full mx-auto",
        "max-w-[var(--container-max)]",
        "px-[var(--side-pad)]",
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}
