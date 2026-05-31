import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  rhythm?: "default" | "tight" | "loose";
};

const rhythms: Record<NonNullable<SectionProps["rhythm"]>, string> = {
  tight: "py-[var(--space-7)]",
  default: "py-[var(--space-8)]",
  loose: "py-[var(--space-9)]",
};

export function Section({
  className,
  children,
  rhythm = "default",
  ...rest
}: SectionProps) {
  return (
    <section className={cn(rhythms[rhythm], className)} {...rest}>
      {children}
    </section>
  );
}
