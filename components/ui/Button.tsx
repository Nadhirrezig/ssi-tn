import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

type ButtonBase = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonBase &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBase & {
  href: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

const styles: Record<Variant, string> = {
  primary: cn(
    "inline-flex items-center justify-center",
    "h-12 px-5",
    "rounded-[2px]",
    "bg-ink text-paper",
    "text-[length:var(--text-body)] font-medium",
    "transition-opacity duration-[var(--dur-base)] [transition-timing-function:var(--ease-quart)]",
    "hover:opacity-90 focus-visible:opacity-90",
  ),
  secondary: cn(
    "inline-flex items-baseline",
    "text-ink font-medium",
    "link-underline link-underline-grow",
  ),
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const variant: Variant = props.variant ?? "primary";

  if ("href" in props && props.href !== undefined) {
    const { href, className, children, target, rel, variant: _v, ...rest } =
      props as ButtonAsLink & { variant?: Variant };
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={cn(styles[variant], className)}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  const { className, children, variant: _v, ...rest } = props as ButtonAsButton;
  return (
    <button className={cn(styles[variant], className)} {...rest}>
      {children}
    </button>
  );
}
